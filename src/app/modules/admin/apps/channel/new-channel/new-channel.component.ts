import {ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {BrowseChannelModel} from "../../../../../store/browseChannel/browse.channel.model";
import {BrowseChannelState} from "../../../../../store/browseChannel/browse.channel.state";
import {Select, Store} from "@ngxs/store";
import {FetchPageBrowsChannel, SubscribeChannel} from "../../../../../store/browseChannel/browse.channel.actions";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {SubscribeChannelComponent} from "../subscribe-channel/subscribe-channel.component";

@Component({
    selector: 'app-new-channel',
    templateUrl: './new-channel.component.html',
    styleUrls: ['./new-channel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class NewChannelComponent implements OnInit {
    @Select(BrowseChannelState.getBrowseChannelList) browseChannel: Observable<BrowseChannelModel>;
    @Select(BrowseChannelState.getBrowseChannelPage) browseChannelPage: Observable<number>;
    @Select(BrowseChannelState.getBrowseChannelTotalPage) browseChannelTotalPage: Observable<number>;
    pageNum: number;
    totalNum: number;
    dialogRef: any;
    dataSource: PeriodicElement[] = [];
    displayedColumns: string[] = ['id', 'name', 'type', 'users', 'subtitle'];
    composeForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<NewChannelComponent>,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
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
        // Create the form
        this.composeForm = this._formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            type: ['', [Validators.required]],
            subscribe: ['', [Validators.required]],
            space: ['', [Validators.required]],
            visibility: ['', [Validators.required]]
        });

        this.browseChannelPage.subscribe(res => {
            this.pageNum = res;
            this._changeDetectorRef.detectChanges();
        });
        this.browseChannelTotalPage.subscribe(res => {
                this.totalNum = res
            });

        this.browseChannel
            .subscribe((res: any) => {
                this.dataSource = res;
            })
    }

    /**
     * Save and close
     */
    saveAndClose(): void {
        this.matDialogRef.close();
    }

    resetForm = () => {
        this.composeForm.reset()
    }

    subscribeToChannel = (channel) => {
        if (channel['user']['isSubscribed']) {
            return;
        }
        else {
            this.dialogRef = this._matDialog.open(SubscribeChannelComponent, {
                panelClass: 'sub-compose-dialog',
                data: {
                    channel: channel
                }
            });
            this.dialogRef.afterClosed()
                .subscribe(response => {
                    if (!response) {
                        return;
                    }
                    this.isSubscribed(channel);
                })
        }
    };

    isSubscribed = (channel) => {
        this.store.dispatch(new SubscribeChannel(channel))
    };

    prePage = (pNum) => {
        if (pNum === 1) {
            return;
        } else {
            let pageNum = --this.pageNum;
            this.store.dispatch(new FetchPageBrowsChannel(pageNum))
        }
    };

    nextPage = (pNum) => {
        if (pNum === this.totalNum) {
            return;
        } else {
            let pageNum = ++this.pageNum;
            this.store.dispatch(new FetchPageBrowsChannel(pageNum))
        }
    };
}

export interface PeriodicElement {
    id: string;
    name: string;
    type: string;
    users: string;
    subtitle: string;
}
