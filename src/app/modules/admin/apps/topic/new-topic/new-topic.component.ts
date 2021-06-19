import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewTopicComponent implements OnInit {
    composeForm: FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<NewTopicComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.composeForm = this.createTopic();
    }

    createTopic (): FormGroup
    {
        return new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
        });
    }

    ngOnInit(): void {
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    resetForm = () => {
        this.composeForm.reset()
    }

}
