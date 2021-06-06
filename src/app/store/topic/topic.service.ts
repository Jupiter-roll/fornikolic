import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TopicModel} from './topic.model';
import {domain} from "../../../@fuse/config/rest.api";

@Injectable({
    providedIn: 'root'
})

export class TopicService {
    token = {'Authorization': 'Bearer ' + localStorage.getItem('token')};
    userId = localStorage.getItem('userId');
    constructor(
        private http: HttpClient
    ) {}

    fetchTopic(payload: any) {
        let channelId = payload['channelId'];
        let pageNum = payload['pageNum'] === null ? 1 : payload['pageNum'];
        return this.http.get<TopicModel[]>(domain + 'channels/' + channelId + '/topics?page=' + pageNum,
            {
                headers : this.token
            })
    }

    addTopic(payload) {
        return this.http.post<TopicModel[]>(domain + 'topics',
            payload,
            {
                headers: this.token
            })
    }

    updateTopic(payload) {
        return this.http.post<TopicModel[]>(domain + 'topics/' + this.userId + '/update',
            payload,
            {
                headers: this.token
            })
    }

    setNotification(payload) {
        let topicId =  payload.topicId;
        let notify = payload.notify;
        return this.http.post(domain + 'topics/' + topicId + '/settings',
            {
                notify: notify
            }, {
                headers: this.token
            })
    }

    setStatus(payload) {
        let topicId = payload.topicId;
        let status = payload.status ? '/inactive' : '/active';
        return this.http.post(domain + 'topics/' + topicId + '/' + status,
            {},
            {
                headers: this.token
            })
    }
}
