import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import {ChannelModule} from "./modules/admin/apps/channel/channel.module";
import {NgxsModule} from "@ngxs/store";
import {ChannelState} from "./store/channel/channel.state";
import {environment} from "../environments/environment";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {BrowseChannelState} from "./store/browseChannel/browse.channel.state";
import {TopicState} from "./store/topic/topic.state";
import {MessageState} from "./store/message/message.state";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { TopicComponent } from './modules/admin/apps/topic/topic.component';
import {TopicModule} from "./modules/admin/apps/topic/topic.module";
import {SocketService} from "../@fuse/config/socket.service";

const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy       : PreloadAllModules
};

const config: SocketIoConfig = {
    url : environment.websocketUrl,
    options: {
        query: {
            token: environment.authorizationToken
        },
        transports: ['websocket'],
        upgrade: false,
        secure: false,
    }
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, {relativeLinkResolution: 'legacy'}),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        ChannelModule,
        TopicModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),

        NgxsModule.forRoot([MessageState ,TopicState ,BrowseChannelState, ChannelState], {
            developmentMode: !environment.production
        }),
        NgxsLoggerPluginModule.forRoot(),

        SocketIoModule.forRoot(config)
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [SocketService]
})
export class AppModule
{
}
