import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MessageModel} from './message.model';
import {Socket} from "ngx-socket-io";
import {map} from "rxjs/operators";
import {domain} from "../../../@fuse/config/rest.api";

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    token = {'Authorization': 'Bearer ' + localStorage.getItem('token')};
    userId = localStorage.getItem('userId');
    constructor(
        private http: HttpClient,
        private socket: Socket,
    ) {}

    fetchMessage(topicId) {
        return this.http.get<MessageModel[]>(domain + 'topics/' + topicId + '/messages?pageSize=100',
            {
                headers: this.token
            })
    }

    addNewMessage(payload) {
        this.socket.emit("message", payload);
        return this.http.post<MessageModel[]>(domain + 'messages',
            payload,
            {
                headers: this.token
            })
    }

    getMessage() {
        return this.socket.fromEvent("message")
            .pipe(map((data) => console.log('==========>', data)))
    }
}
