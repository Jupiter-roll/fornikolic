import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chat, Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { v4 as uuidv4 } from 'uuid';
import {NewTopicComponent} from "../../topic/new-topic/new-topic.component";
import {MatDialog} from "@angular/material/dialog";
import {ChannelModel} from "../../../../../store/channel/channel.model";
import {ChannelState} from "../../../../../store/channel/channel.state";
import {Select, Store} from "@ngxs/store";
import {
    AddNewTopic,
    ChangeTopic,
    FetchTopic,
    SetTopicNotification, SetTopicStatus,
    UpdateTopic
} from "../../../../../store/topic/topic.actions";
import {TopicModel} from "../../../../../store/topic/topic.model";
import {TopicState} from "../../../../../store/topic/topic.state";
import {FetchMessage} from "../../../../../store/message/message.actions";
import {EditTopicComponent} from "../../topic/edit-topic/edit-topic.component";
import {data} from "autoprefixer";
import {TopicSettingComponent} from "../../topic/topic-setting/topic-setting.component";
import {TopicStatusComponent} from "../../topic/topic-status/topic-status.component";

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: Profile;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Select(ChannelState.getSelectedChannel) getSelectedChannel: Observable<ChannelModel>;
    @Select(TopicState.getTopicsList) getTopicsList: Observable<TopicModel>;
    @Select(TopicState.getSelectedTopic) getSelectedTopic: Observable<TopicModel>;
    @Select(TopicState.getTopicPage) getTopicPage: Observable<number>;
    @Select(TopicState.getTopicTotalPage) getTopicTotalPage: Observable<number>;
    channelId: string;
    pageNum: number = 1 ;
    totalNum: number;
    status: Boolean = false;
    getTopics: any;
    selectedTopic: TopicModel;
    dialogRef: any;
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private store: Store,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = this.filteredChats = chats;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.getSelectedChannel.subscribe(response => {
            if (response) {
                this.channelId = response.id;
                this.store.dispatch(new FetchTopic({
                    'channelId': response.id,
                    'pageNum': this.pageNum
                })).subscribe(res => {
                    this.getTopics = res.topicList.topicList
                    this._changeDetectorRef.detectChanges()
                })
            } else {
                this.getTopics = [];
            }
        });

        this.getTopicsList.subscribe(res => {
            if (res) {
                this.getTopics = res;
                this._changeDetectorRef.detectChanges()
            }
        });

        this.getTopicTotalPage
            .subscribe(res => {
                this.totalNum = res;
            });
        this.getSelectedTopic.subscribe(response => {
            if (response) {
                this.selectedTopic = response;
                for (let items of this.getTopics) {
                    if (items.id === response.id) {
                        items = Object.assign({active:true}, items);
                        this._changeDetectorRef.detectChanges();
                    }
                }
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        // Reset the filter
        if ( !query )
        {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void
    {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    };

    openNewTopic = (data) => {
        this.dialogRef = this._matDialog.open(NewTopicComponent, {
            panelClass: 'mail-compose-dialog',
            disableClose: true,
            data: {
                topic: data
            }
        });
        this.topicAction();
    };

    getChat = (data) => {
        this.store.dispatch(new ChangeTopic(data));
        this.store.dispatch(new FetchMessage(data.id));
    };

    saveTopic = (event) => {
        let value = event.value;
        let topic = {
            id: uuidv4(),
            channelId: this.channelId,
            name: value.title,
            description: value.description
        };
        this.store.dispatch(new AddNewTopic(topic))
    };

    updateTopic = (event) => {
        console.log(event, 'update topic')
        let value = event.value;
        let topic = {
            id: this.selectedTopic.id,
            name: value.title,
            description: value.description
        };
        this.store.dispatch(new UpdateTopic(topic));
    };

    editTopic = (data) => {

        let token = localStorage.getItem('userId');
        if (token === data['system']['userId']) {
            this.dialogRef = this._matDialog.open(EditTopicComponent, {
                panelClass: 'setting-dialog',
                disableClose: true,
                data: {topic: data}
            });
            this.topicAction();
        } else {
            window.confirm('you are not admin')
        }
    };

    topicAction = () => {
        this.dialogRef.afterClosed().subscribe((response) => {
            if (!response) {
                return;
            }
            console.log(response, 'edit ')
            const actionType: string = response[0];
            const formData: FormData = response[1];
            switch (actionType) {
                case 'addTopic':
                    this.saveTopic(formData);
                    break;
                case 'editTopic':
                    this.updateTopic(formData);
                    break;
            }
        })
    };

    settingTopic = (topic) => {
        this.dialogRef = this._matDialog.open(TopicSettingComponent, {
            panelClass: 'setting-dialog',
            disableClose: true,
            data: {topic: topic}
        });
        this.dialogRef.afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormData = response[1];
            switch (actionType) {
                case 'setting':
                    this.saveSetting(formData);
                    break;
            }
        })
    };

    saveSetting = (data) => {
        let value = data.value;
        let notification = {
            notify: value.isCheck,
            topic: this.selectedTopic.id
        };
        this.store.dispatch(new SetTopicNotification(notification));
    };

    topicState = () => {
        this.dialogRef = this._matDialog.open(TopicStatusComponent, {
            panelClass: 'setting-dialog',
            disableClose: true,
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                switch (actionType) {
                    case 'status' :
                        this.saveStatus();
                        break;
                }
            })
    };

    saveStatus = () => {
        let status = {
            topicId : this.selectedTopic.id,
            active: this.status
        };
        this.store.dispatch(new SetTopicStatus(status))
    };

}
