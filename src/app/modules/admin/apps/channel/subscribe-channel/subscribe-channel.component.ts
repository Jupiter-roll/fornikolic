import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {ChannelModel} from "../../../../../store/channel/channel.model";
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-subscribe-channel',
  templateUrl: './subscribe-channel.component.html',
  styleUrls: ['./subscribe-channel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SubscribeChannelComponent implements OnInit {

    showExtraToFields: boolean;
    subscribeForm: FormGroup;
    channelData: ChannelModel;

  constructor(
      public matDialogRef: MatDialogRef<SubscribeChannelComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
      this.channelData = _data.channel;
      this.subscribeForm = this.subscribeChannel();
      this.showExtraToFields = false;
  }


    subscribeChannel(): FormGroup {
        return new FormGroup({})
    }

  ngOnInit(): void {
  }

    saveAndClose(): void
    {
        this.matDialogRef.close();
    }

}
