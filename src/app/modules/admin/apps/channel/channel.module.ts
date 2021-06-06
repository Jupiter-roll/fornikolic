import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChannelComponent} from "./channel.component";
import { NewChannelComponent } from './new-channel/new-channel.component';
import {SharedModule} from "../../../../shared/shared.module";
import {FuseScrollResetModule} from "../../../../../@fuse/directives/scroll-reset";
import {FuseScrollbarModule} from "../../../../../@fuse/directives/scrollbar";
import {FuseNavigationModule} from "../../../../../@fuse/components/navigation";
import {FuseFindByKeyPipeModule} from "../../../../../@fuse/pipes/find-by-key";
import {QuillModule} from "ngx-quill";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
      ChannelComponent,
      NewChannelComponent
  ],
  imports: [
    CommonModule,

      MatButtonModule,
      MatCheckboxModule,
      MatDialogModule,
      MatDividerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatMenuModule,
      MatProgressBarModule,
      MatSelectModule,
      MatSidenavModule,
      QuillModule.forRoot(),
      FuseFindByKeyPipeModule,
      FuseNavigationModule,
      FuseScrollbarModule,
      FuseScrollResetModule,
      SharedModule
  ]
})
export class ChannelModule { }
