import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BooleanInput} from '@angular/cdk/coercion';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseVerticalNavigationComponent} from '@fuse/components/navigation/vertical/vertical.component';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {FuseNavigationItem} from '@fuse/components/navigation/navigation.types';
import {Select, Store} from "@ngxs/store";
import {ChannelState} from "../../../../../../app/store/channel/channel.state";
import {ChannelModel} from "../../../../../../app/store/channel/channel.model";
import {ChangeChannel} from "../../../../../../app/store/channel/channel.actions";

@Component({
    selector: 'fuse-vertical-navigation-group-item',
    templateUrl: './group.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseVerticalNavigationGroupItemComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */
    @Input() autoCollapse: boolean;
    @Input() item: any;
    @Input() name: string;
    @Input() activeStatus: boolean;
    @Select(ChannelState.getChannelList) channels: Observable<ChannelModel[]>;
    private _fuseVerticalNavigationComponent: FuseVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private store: Store,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the parent navigation component
        this._fuseVerticalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

        this._fuseVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngChange() {
        console.log(this.item, '=')
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    };

    sideClick = (id) => {
        this.store.dispatch(new ChangeChannel({id: id}))
    }
}
