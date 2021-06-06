import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BrowseChannelModel} from "./browse.channel.model";
import {domain} from "../../../@fuse/config/rest.api";

@Injectable({
    providedIn: 'root'
})

export class BrowseChannelService {
    token = {'Authorization': 'Bearer ' + localStorage.getItem('token')};
    url = domain + 'browse.channels';
    constructor(
        private http: HttpClient,
    ) {}


    browseChannel(page) {
        return this.http.get<BrowseChannelModel[]>( this.url + '?page=' + page,
            {
                headers: this.token
            })
    }

    subscribeIntoChannel(payload) {
        let channelId = payload.id;
        return this.http.post(this.url + '/' + channelId + '/subscribe',
            {},
            {
                headers: this.token
            })
    }
}
