import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chat, Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import {NewChannelComponent} from "../../channel/new-channel/new-channel.component";
import {NewTopicComponent} from "../../topic/new-topic/new-topic.component";
import {MatDialog} from "@angular/material/dialog";
import {ChannelModel} from "../../../../../store/channel/channel.model";
import {ChannelState} from "../../../../../store/channel/channel.state";
import {Select, Store} from "@ngxs/store";
import {FetchTopic} from "../../../../../store/topic/topic.actions";
import {TopicModel} from "../../../../../store/topic/topic.model";
import {TopicState} from "../../../../../store/topic/topic.state";

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

    openNewTopic = () => {
        const dialogRef = this._matDialog.open(NewTopicComponent);
        dialogRef.afterClosed().subscribe(() => {
            console.log('new topic close')
        })
    }
}
