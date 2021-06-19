import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChannelSettingComponent} from "../channel-setting/channel-setting.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-channel-status',
    templateUrl: './channel-status.component.html',
    styleUrls: ['./channel-status.component.scss']
})
export class ChannelStatusComponent implements OnInit {

    statusForm: FormGroup;
    _status: Boolean;
    constructor(
        public matDialogRef: MatDialogRef<ChannelSettingComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.statusForm = this.channelStatus();
    }

    ngOnInit(): void {
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    };

    changeCheckbox = (event) => {
        this._status = !event;
        this._changeDetectorRef.detectChanges();
    };

    channelStatus(): FormGroup {
        return new FormGroup({
            isCheck: new FormControl(this._status),
        })
    };

    channelOff = () => {
        if (window.confirm('This form will lose changes')) {
            this.matDialogRef.close()
        }
    }
}
