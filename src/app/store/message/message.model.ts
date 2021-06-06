export class MessageModel {
    id?: string;
    data?: {
        channelId?: string;
        topicId?: string;
        text?: string;
    };
    system?: {
        createdAt?: string;
        updatedAt?: string;
        spaceId?: string;
        userId?: string;
        model?: number
    };
    user?: {
        isAdmin?: boolean;
    }
}
