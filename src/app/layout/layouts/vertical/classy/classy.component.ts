import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { InitialData } from 'app/app.types';
import {NewChannelComponent} from "../../../../modules/admin/apps/channel/new-channel/new-channel.component";
import {MatDialog} from "@angular/material/dialog";
import {ChannelState} from "../../../../store/channel/channel.state";
import {Select, Store} from "@ngxs/store";
import {AddNewChannel, FetchPageChannel} from "../../../../store/channel/channel.actions";
import { v4 as uuidv4 } from 'uuid';
@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    data: InitialData;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Select(ChannelState.getChannelPage) channelPage: Observable<number>;
    @Select(ChannelState.getChannelTotalPage) channelTotalPage: Observable<number>;
    pageNum: number;
    totalNum: number;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _matDialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private store: Store,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the resolved route data
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this.channelPage
            .subscribe(res => {
                this.pageNum = res;
                this._changeDetectorRef.detectChanges();
            });

        this.channelTotalPage
            .subscribe(res => {
                this.totalNum = res;
                this._changeDetectorRef.detectChanges();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    openNewChannel(): void {
        const dialogRef = this._matDialog.open(NewChannelComponent, {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormData = response[1];
            switch (actionType) {
                case 'send':
                    this.saveChannel(formData);
                    break;
            }
        })
    };

    saveChannel = (event) => {
        let value = event.value;
        let newChannel = {
            id: uuidv4(),
            name: value.title,
            description : value.description ? value.description : null,
            type: value.type,
            subscribe: value.subscribe,
            space: value.space,
            visibility: value.visibility
        };
        this.store.dispatch(new AddNewChannel(newChannel));

    }

    moreChannel = (pNum) => {
        if (pNum === this.totalNum) {
            return;
        } else {
            let pageNum = ++this.pageNum;
            this.store.dispatch(new FetchPageChannel(pageNum))
        }
    }
}
