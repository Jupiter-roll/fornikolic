import {ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TopicModel} from "../../../../../store/topic/topic.model";
import {Observable} from "rxjs";
import {TopicState} from "../../../../../store/topic/topic.state";
import {Select} from "@ngxs/store";

@Component({
    selector: 'app-topic-setting',
    templateUrl: './topic-setting.component.html',
    styleUrls: ['./topic-setting.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopicSettingComponent implements OnInit {

    @Select(TopicState.getTopicSetting) topicSetting: Observable<Boolean>;
    settingForm: FormGroup;
    topic: TopicModel;
    _isSetting: Boolean = false;
    constructor(
        public matDialogRef: MatDialogRef<TopicSettingComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.topic = _data.topic;
        this.settingForm = this.createSettingForm();
    }

    ngOnInit(): void {
        this.topicSetting
            .subscribe(res => {
                this._isSetting = res
            })
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    };

    createSettingForm(): FormGroup {
        return this._formBuilder.group({
            isCheck: new FormControl(false)
        })
    };

    channelOff = () => {
        if (window.confirm('This form will lose changes')) {
            this.matDialogRef.close()
        }
    };

}
