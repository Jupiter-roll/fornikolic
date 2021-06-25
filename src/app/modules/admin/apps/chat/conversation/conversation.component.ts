import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil, window} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {Chat} from 'app/modules/admin/apps/chat/chat.types';
import {ChatService} from 'app/modules/admin/apps/chat/chat.service';
import {MessageModel} from "../../../../../store/message/message.model";
import {MessageState} from "../../../../../store/message/message.state";
import {TopicState} from "../../../../../store/topic/topic.state";
import {Select, Store} from "@ngxs/store";
import {TopicModel} from "../../../../../store/topic/topic.model";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';
import {AddMessage} from "../../../../../store/message/message.actions";

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    @ViewChild('replyForm') replyForm: NgForm;
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    user = localStorage.getItem('userId');
    dialog: any;
    contact: any;
    replyInput: any;
    topic: TopicModel;
    selectedTopicId: string;
    selectedChat: any;
    myMessageNum: number;
    compId: string;
    @Select(TopicState.getSelectedTopic) selectedTopic: Observable<TopicModel>;
    @Select(MessageState.getMessageList) getMessage: Observable<MessageModel>;
    accept: 'application/x-zip-compressed,image/*';
    fileSelected = false;
    file: File | null = null;
    imageURL: string;
    uploadedFileStyle: any;
    uploadedFileStyleStatus: boolean = false
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private store: Store,
        private _formBuilder: FormBuilder,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.selectedTopic.subscribe(data => {
                this.topic = data;
                if (data) {
                    if (this.selectedTopicId !== data.id) {
                        this.selectedTopicId = data.id;
                        this.uploadedFileStyleStatus = false;
                        this._changeDetectorRef.detectChanges();
                    } else {
                        console.log('here')
                    }
                }
            });

        this.getMessage
            .subscribe(async chatData => {
                this.myMessageNum = 0;
                if ( chatData )
                {
                    this.selectedChat = chatData;
                    this.readyToReply();
                }
                let data = [];
                for (let item in chatData) {
                    if (chatData[item].system.userId !== localStorage.getItem('userId')) {
                        this.compId = chatData[item].system.userId;
                    }
                    await data.push(chatData[item]);
                }
                this.myMessageNum = data.length - 1;
                this._changeDetectorRef.detectChanges();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */
    openContactInfo(): void {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    };

    readyToReply = () => {

    }

    reply(event): void {
        event.preventDefault();
        if (event.target.value === '' || event.target.value === undefined) {
            return;
        }
        if (!this.topic) {
            alert('select topic');
            this.messageInput.nativeElement.value = ''
            return;
        }
        let replyMessage = {
            id: uuidv4(),
            channelId: this.topic.data.channelId,
            topicId: this.topic.id,
            text: event.target.value,
            attachments: this.uploadedFileStyle
        };
        this.store.dispatch(new AddMessage(replyMessage))
        this.messageInput.nativeElement.value = '';
        this.uploadedFileStyleStatus = false;
    };

    uploadFile(files: FileList | null): void {
        if (files) {
            let base64String = ''
            this.fileSelected = true
            this.file = files.item(0);
            let reader = new FileReader();
            reader.onload = function () {
                if (typeof reader.result === "string") {
                    base64String = reader.result.replace("data:", "")
                        .replace(/^.+,/, "");
                }
            }
            reader.readAsDataURL(this.file)
            setTimeout(() => {
                this.uploadedFileStyle = [{
                    filename: this.file.name,
                    contentType: this.file.type,
                    contentBase64: base64String
                }];
                this.uploadedFileStyleStatus = true;
                this._changeDetectorRef.detectChanges();
            }, 400)
        }
    };

    removeAttach = () => {
        this.uploadedFileStyleStatus = false
    }

}
