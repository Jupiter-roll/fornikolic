import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ChannelModel} from './channel.model';
import {domain} from "../../../@fuse/config/rest.api";

@Injectable({
    providedIn: 'root'
})

export class ChannelService {
    token = {'Authorization': 'Bearer ' + localStorage.getItem('token')};
    url = domain + 'channels';
    constructor(
        private http: HttpClient,
    ) {}

    fetchChannel(page) {
        return this.http.get<ChannelModel[]>(this.url + '?page=' + page,
            {
                headers : this.token
            })
    }

    addChannel(payload) {
        return this.http.post<ChannelModel[]>(this.url,
            payload,
            {
                headers : this.token
            })
    }

    updateChannel(payload) {
        let channelId = payload.id;
        return this.http.post<ChannelModel[]>(this.url + '/' + channelId + '/update',
            payload,
            {
                headers: this.token
            })
    }

    setNotify(payload: any) {
        let channelId = payload.channelId;
        let notify = payload.notify;
        return this.http.post(this.url + '/' + channelId + '/settings', {
            notify: notify
        }, {
            headers : this.token
        })
    }

    setChannelStatus(payload: any) {
        let channelId = payload.channelId;
        let status = payload.active ? '/inactive' : '/active';
        return this.http.post(this.url + '/' + channelId + status,
            {},
            {
                headers : this.token
            })
    }
}
