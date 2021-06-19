import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import {EditChannelComponent} from "../../../modules/admin/apps/channel/edit-channel/edit-channel.component";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngxs/store";
import {FormGroup} from "@angular/forms";
import {SetChannelStatus, SetNotification, UpdateChannel} from "../../../store/channel/channel.actions";
import {ChannelSettingComponent} from "../../../modules/admin/apps/channel/channel-setting/channel-setting.component";
import {ChannelStatusComponent} from "../../../modules/admin/apps/channel/channel-status/channel-status.component";

@Component({
    selector       : 'user-menu',
    templateUrl    : './user-menu.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'userMenu'
})
export class UserMenuComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    @Input() selectChannel: any;
    @Input() adminStatus = false;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dialogRef: any;
    _isStatus: Boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        public _matDialog: MatDialog,
        private store: Store,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                this._changeDetectorRef.markForCheck();
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

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    };

    editChannel = (channel) => {
        this.dialogRef = this._matDialog.open(EditChannelComponent, {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
            data: {channel: channel}
        });
        this.dialogRef.afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];
            switch (actionType) {
                case 'save':
                    this.editCurrentChannel(formData.getRawValue());
                    break;
            }
        })
    };

    editCurrentChannel = (value) => {
        let channel = {
            id: this.selectChannel.id,
            name: value.title,
            description: value.description
        };
        this.store.dispatch(new UpdateChannel(channel))
    };

    channelSetting = (id) => {
        this.dialogRef = this._matDialog.open(ChannelSettingComponent, {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
            data: {channelId: id}
        });
        this.dialogRef.afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];
            switch (actionType) {
                case 'save':
                    this.saveSetting(formData.getRawValue());
                    break;
            }
        })
    };

    saveSetting = (value) => {
        let notification = {
            notify: value.isCheck,
            channelId: this.selectChannel.id
        };
        this.store.dispatch(new SetNotification(notification))
    };

    channelStatus = () => {
        this.dialogRef = this._matDialog.open(ChannelStatusComponent,  {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                switch (actionType) {
                    case 'status' :
                        this.saveStatus();
                        break;
                }
            })
    };

    saveStatus = () => {
        let status = {
            channelId: this.selectChannel.id,
            active: this._isStatus
        };
        this.store.dispatch(new SetChannelStatus(status))
    }
}
