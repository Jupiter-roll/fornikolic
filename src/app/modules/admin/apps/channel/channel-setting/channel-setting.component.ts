import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-channel-setting',
    templateUrl: './channel-setting.component.html',
    styleUrls: ['./channel-setting.component.scss']
})
export class ChannelSettingComponent implements OnInit {

    settingForm: FormGroup;
    _isSetting: Boolean = false;

    constructor(
        public matDialogRef: MatDialogRef<ChannelSettingComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.settingForm = this.createSetting();
    }

    ngOnInit(): void {
    }

    createSetting(): FormGroup
    {
        return new FormGroup({
            isCheck: new FormControl(false),
        })
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    };

    channelOff = () => {
        if (window.confirm('This form will lose changes')) {
            this.matDialogRef.close()
        }
    };

    changeCheckbox = (event) => {
        this._isSetting = !event;
        this._changeDetectorRef.detectChanges();
    };

}
