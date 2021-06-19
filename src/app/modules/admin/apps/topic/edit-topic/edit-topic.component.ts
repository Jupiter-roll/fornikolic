import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TopicModel} from "../../../../../store/topic/topic.model";

@Component({
    selector: 'app-edit-topic',
    templateUrl: './edit-topic.component.html',
    styleUrls: ['./edit-topic.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditTopicComponent implements OnInit {
    composeForm: FormGroup;
    topic: TopicModel;
    constructor(
        public matDialogRef: MatDialogRef<EditTopicComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.composeForm = this.editTopic();
        this.topic = _data.topic;
        this.composeForm = this.createSettingForm();
    }

    ngOnInit(): void {
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    };

    editTopic (): FormGroup
    {
        return new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
        });
    }

    resetForm = () => {
        this.composeForm.reset()
    };

    topicOff = () => {
        if (window.confirm('This form will lose changes')) {
            this.matDialogRef.close()
        }
    };

    createSettingForm(): FormGroup {
        return this._formBuilder.group({
            title: [this.topic.data.name],
            description: [this.topic.data.description]
        })
    }
}
