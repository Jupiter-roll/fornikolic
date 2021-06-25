import {Injectable} from '@angular/core';
import {State, Action, StateContext, Selector, Store, NgxsOnInit} from '@ngxs/store';
import {Socket} from 'ngx-socket-io';
import {AddMessage, FetchMessage, MessageUpdate} from './message.actions';
import {MessageModel} from './message.model';
import {MessageService} from './message.service';
import {SocketService} from "../../../@fuse/config/socket.service";

export interface MessageStateModel {
    messageList: MessageModel[],
    selectedMessage: MessageModel[];
}
@State<MessageStateModel>({
    name: 'messageList',
    defaults: {
        messageList: [],
        selectedMessage: null
    }
})

@Injectable()
export class MessageState implements NgxsOnInit {

    constructor(
        private store: Store,
        private messageService: MessageService,
        private socket: Socket,
        private socketService: SocketService
    ) {
        this.socket.on('*', () => {
            console.log('connect to->>>>>>>>>>>>>>>>>>>>>>>>>>>: ')
        });

        this.getEventListener().subscribe(() => {
            console.log(123)
        });

        this.socket.on('reconnect', (data) => {
            console.log('reconnected!', data);
        });

        this.socket.emit('whoami', 'test123', (data) => {
            console.log('who am i=>>>>>>', data)
        });

        this.socket.fromEvent('message.added').subscribe((item: any) => {
            console.log('received changed', item);

            const temp = Object.assign({}, item.new);
            delete temp._id;
            const message : MessageModel = Object.assign({}, temp);

            this.store.dispatch(new MessageUpdate(message.id, message));
        });
    }

    ngxsOnInit() {
        this.socketService.setupSocketConnection();
    }


    @Selector()
    static getMessageList(state: MessageStateModel) {
        return state.messageList
    }

    @Selector()
    static getSelectedMessage(state: MessageStateModel) {
        return state.selectedMessage
    }

    @Action(FetchMessage)
    fetchMessage({getState, setState}: StateContext<MessageStateModel>, {payload}: FetchMessage) {
        let state = getState();
        return new Promise((resolve, reject) => {
            this.messageService.fetchMessage(payload)
                .subscribe((response: object) => {
                    let res = response['rows'];
                    res.sort((a, b) => {
                        return b['system']['updatedAt'] > a['system']['updatedAt'] ? -1: 1;
                    });
                    resolve(res);
                    setState({
                        ...state,
                        messageList: res
                    })
                }, reject)
        })
    }

    @Action(AddMessage)
    addMessage({getState, setState}: StateContext<MessageStateModel>, {payload}: AddMessage) {
        let topicId = payload.topicId;
        return new Promise((resolve, reject) => {
            this.messageService.addNewMessage(payload)
                .subscribe(() => {
                    this.store.dispatch(new FetchMessage(topicId));
                }, reject)
        })
    }

    public getEventListener() {
        return this.socket.fromEvent('notification');
    }
}
