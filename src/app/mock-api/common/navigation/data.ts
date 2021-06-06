/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.chat',
                title: 'Chat',
                type : 'basic',
                icon : 'heroicons_outline:chat-alt',
                link : '/apps/chat'
            }
        ]
    }
];
