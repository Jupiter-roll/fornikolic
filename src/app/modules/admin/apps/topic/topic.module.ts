import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopicComponent} from "./topic.component";
import {RouterModule} from "@angular/router";
import { NewTopicComponent } from './new-topic/new-topic.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {QuillModule} from "ngx-quill";
import {FuseFindByKeyPipeModule} from "../../../../../@fuse/pipes/find-by-key";
import {FuseNavigationModule} from "../../../../../@fuse/components/navigation";
import {FuseScrollbarModule} from "../../../../../@fuse/directives/scrollbar";
import {FuseScrollResetModule} from "../../../../../@fuse/directives/scroll-reset";
import {SharedModule} from "../../../../shared/shared.module";
import { EditTopicComponent } from './edit-topic/edit-topic.component';
import { TopicSettingComponent } from './topic-setting/topic-setting.component';
import { TopicStatusComponent } from './topic-status/topic-status.component';



@NgModule({
  declarations: [
      TopicComponent,
      NewTopicComponent,
      EditTopicComponent,
      TopicSettingComponent,
      TopicStatusComponent
  ],
    imports: [
        CommonModule,
        RouterModule,

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
export class TopicModule { }
