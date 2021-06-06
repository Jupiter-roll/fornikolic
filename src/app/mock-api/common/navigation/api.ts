import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { defaultNavigation} from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        this.registerHandlers();
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                // Return the response
                return [
                    200,
                    {
                        default   : cloneDeep(this._defaultNavigation),
                    }
                ];
            });
    }
}
