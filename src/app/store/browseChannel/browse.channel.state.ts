import {Injectable} from "@angular/core";
import {Action, NgxsOnInit, Selector, State, StateContext, Store} from "@ngxs/store";
import {FetchPageBrowsChannel, SubscribeChannel} from "./browse.channel.actions";
import {BrowseChannelModel} from "./browse.channel.model";
import {BrowseChannelService} from "./browse.channel.service";
import {FetchPageChannel} from "../channel/channel.actions";

export interface BrowseChannelStateModel {
    browseChannelList: BrowseChannelModel[],
    page: number,
    totalPages: number
}
@State<BrowseChannelStateModel>({
    name: 'browseChannelList',
    defaults: {
        browseChannelList: [],
        page: null,
        totalPages: null
    }
})

@Injectable()
export class BrowseChannelState implements NgxsOnInit {
    constructor(
        private store: Store,
        private browseChannelService: BrowseChannelService
    ) {}

    @Selector()
    static getBrowseChannelList(state: BrowseChannelStateModel) {
        return state.browseChannelList
    }

    @Selector()
    static getBrowseChannelPage(state: BrowseChannelStateModel) {
        return state.page
    }

    @Selector()
    static getBrowseChannelTotalPage(state: BrowseChannelStateModel) {
        return state.totalPages
    }

    ngxsOnInit(ctx: StateContext<BrowseChannelModel>): void {
        ctx.dispatch(new FetchPageBrowsChannel(1))
    }

    @Action(FetchPageBrowsChannel)
    subscribedChannel({getState, setState} : StateContext<BrowseChannelStateModel>, {payload}: FetchPageBrowsChannel) {
        let state = getState();
        return new Promise((resolve, reject) => {
            this.browseChannelService.browseChannel(payload)
                .subscribe((response: any) => {
                    let res = response['rows'];
                    setState({
                        ...state,
                        browseChannelList: res,
                        page: response.page,
                        totalPages: response.totalPages,
                    });
                    resolve(res);
                }, reject)
        })
    }

    @Action(SubscribeChannel)
    subscribeChannel({getState, setState}: StateContext<BrowseChannelStateModel>, {payload}: SubscribeChannel) {
        return new Promise((resolve, reject) => {
            let state = getState();
            let browseChannelNum = state.page;
            let channelNum = 1;
            this.browseChannelService.subscribeIntoChannel(payload)
                .subscribe(() => {
                    this.store.dispatch(new FetchPageBrowsChannel(browseChannelNum));
                    this.store.dispatch(new FetchPageChannel(channelNum));
                }, reject);
        })
    }
}
