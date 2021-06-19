import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {ChannelModel} from "../../../../../store/channel/channel.model";

@Component({
    selector: 'app-edit-channel',
    templateUrl: './edit-channel.component.html',
    styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {

    composeForm: FormGroup;
    channel: ChannelModel;

    constructor(
        public matDialogRef: MatDialogRef<EditChannelComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.channel = _data.channel;
        this.composeForm = this.editChannel();
    }

    ngOnInit(): void {

    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    editChannel(): FormGroup
    {
        return new FormGroup({
            title: new FormControl(this.channel['data']['name']),
            description: new FormControl(this.channel['data']['description']),
        });
    };

    resetForm = () => {
        this.composeForm.reset()
    }
}
