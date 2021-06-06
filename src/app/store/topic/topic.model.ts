export class TopicModel {
    id: string;
    data?: {
        channelId?: string;
        name?: string;
        status?: string;
        description?: string;
    };
    system?: {
        createdAt?: string;
        updatedAt?: string;
        spaceId?: string;
        userId?: string;
        model?: number;
    };
    user?: {
        isAdmin?: boolean;
    }
}
