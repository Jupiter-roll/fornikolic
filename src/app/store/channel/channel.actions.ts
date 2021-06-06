import {ChannelModel} from './channel.model';

export class FetchPageChannel {
    static readonly type = '[Channel] Fetch All';
    constructor(public payload: number) {}
}

export class ChangeChannel {
    static readonly type = '[Channel] Change Channel';
    constructor(public payload: ChannelModel) {}
}

export class AddNewChannel {
    static readonly type = '[Channel] Add New Channel';
    constructor(public payload: any) {}
}

export class UpdateChannel {
    static readonly type = '[Channel] Update Channel';
    constructor(public payload: any) {}
}

export class SetNotification {
    static readonly type = '[Channel] Set Channel Notification';
    constructor(public payload: any) {}
}

export class SetChannelStatus {
    static readonly type = '[Channel] Set Channel Status';
    constructor(public payload: any) {}
}
