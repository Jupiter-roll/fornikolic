export class ChannelModel {
    id?: string;
    data?: {
        name?: string;
        description?: string;
        type?: string;
        visibility?: null;
        subscribe?: null;
        status?: null;
        stats?: {
            userCount?: number
        }
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
        isActive?: boolean;
        settings?: string;
    };
    active?: boolean;
    type?: string;
}
