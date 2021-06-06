import {BrowseChannelModel} from "./browse.channel.model";

export class FetchPageBrowsChannel {
    static readonly type = '[Browse Channel] Fetch Browse Channel';
    constructor(public payload: number) {}
}

export class SubscribeChannel {
    static readonly type = '[Browse Channel] Subscribed in Browse Channel';
    constructor(public payload: BrowseChannelModel) {}
}
