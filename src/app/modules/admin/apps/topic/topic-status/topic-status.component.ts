import {ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-topic-status',
    templateUrl: './topic-status.component.html',
    styleUrls: ['./topic-status.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopicStatusComponent implements OnInit {

    statusForm: FormGroup;
    _status: Boolean;
    constructor(
        public matDialogRef: MatDialogRef<TopicStatusComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.statusForm = this.statusTopicForm();
    }

    ngOnInit(): void {
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    };

    statusTopicForm(): FormGroup {
        return this._formBuilder.group({
            isCheck: new FormControl(false),
        })
    }

    channelOff = () => {
        if (window.confirm('This form will lose changes')) {
            this.matDialogRef.close()
        }
    };
}
