export class FetchMessage {
    static readonly type = '[Message] Fetch Message';
    constructor(public payload: string) {}
}

export class AddMessage {
    static readonly type = '[Message] Add Message';
    constructor(public payload: any) {}
}

export class MessageUpdate {
    static readonly type = 'Message Update Massage';
    constructor(public id, public payload) {}
}
