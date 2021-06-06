import {Injectable} from '@angular/core';
import {State, Action, StateContext, Selector, Store} from '@ngxs/store';
import {AddNewTopic, ChangeTopic, FetchTopic, SetTopicNotification, SetTopicStatus, UpdateTopic} from './topic.actions';
import {TopicModel} from './topic.model';
import {TopicService} from './topic.service';

export interface TopicStateModel {
    topicList: TopicModel[];
    page: number,
    totalPages: number,
    isSetting: Boolean,
    selectedTopic: TopicModel,
}
@State<TopicStateModel>({
    name: 'topicList',
    defaults: {
        topicList: [],
        page: null,
        totalPages: null,
        isSetting: null,
        selectedTopic: null,
    }
})
@Injectable()
export class TopicState {

    constructor(
        private store: Store,
        private topicService: TopicService,
    ) {}

    @Selector()
    static getTopicsList(state: TopicStateModel) {
        return state.topicList
    }

    @Selector()
    static getSelectedTopic(state: TopicStateModel) {
        return state.selectedTopic
    }

    @Selector()
    static getTopicPage(state: TopicStateModel) {
        return state.page
    }

    @Selector()
    static getTopicTotalPage(state: TopicStateModel) {
        return state.totalPages
    }

    @Selector()
    static getTopicSetting(state: TopicStateModel) {
        return state.isSetting;
    }

    @Action(FetchTopic)
    fetchTopic({getState, setState}: StateContext<TopicStateModel>, {payload} : FetchTopic) {
        let state = getState();
        return new Promise((resolve, reject) => {
            this.topicService.fetchTopic(payload)
                .subscribe((response: object) => {
                    let res = response['rows'];
                    let currentTopic = state.topicList;
                    let data = [];
                    if (!currentTopic.length) {
                        setState({
                            ...state,
                            page: response['page'],
                            totalPages: response['totalPages'],
                            topicList: res
                        });
                    } else {
                        let currentChannelId = currentTopic[0]['data']['channelId'];
                        let newChannelId = res[0]['data']['channelId'];
                        if (currentChannelId === newChannelId) {
                            for (let item of currentTopic) {
                                data.push(item)
                            }
                            for (let item of res) {
                                data.push(item)
                            }
                            setState({
                                ...state,
                                page: response['page'],
                                totalPages: response['totalPages'],
                                topicList: data
                            });
                        } else {
                            setState({
                                ...state,
                                page: response['page'],
                                totalPages: response['totalPages'],
                                topicList: res
                            });
                        }
                    }
                    resolve(res);
                }, reject);
        });
    }

    @Action(ChangeTopic)
    changeTopic({getState, setState}: StateContext<TopicStateModel>, {payload}: ChangeTopic) {
        let state = getState();
        setState({
            ...state,
            isSetting: payload.user['settings']===null?false:payload.user['settings']['notify'],
            selectedTopic: payload,
        });
    }

    @Action(AddNewTopic)
    addNewTopic({getState, setState}: StateContext<TopicStateModel>, {payload}: AddNewTopic) {
        let state = getState();
        let channelId = payload.channelId;
        let pageNum = state.page;
        if (pageNum === state.totalPages) {
        } else {
            ++pageNum
        }
        this.topicService.addTopic(payload)
            .subscribe(() => {
                this.store.dispatch(new FetchTopic({
                    "channelId": channelId,
                    "pageNum": pageNum
                }))
            })
    }

    @Action(UpdateTopic)
    updateTopic({getState, setState}: StateContext<TopicStateModel>, {payload}: UpdateTopic) {
        let state = getState();
        let channelId = payload.channelId;
        let pageNum = state.page;
        this.topicService.updateTopic(payload)
            .subscribe(() => {
                this.store.dispatch(new FetchTopic({
                    "channelId": channelId,
                    "pageNum": pageNum
                }))
            })
    }

    @Action(SetTopicNotification)
    setTopicNotification({getState, setState}: StateContext<TopicStateModel>, {payload}: SetTopicNotification) {
        let state = getState();
        return new Promise((resolve, reject) => {
            this.topicService.setNotification(payload)
                .subscribe(() => {
                    setState({
                        ...state,
                        isSetting: payload.notify
                    })
                }, reject)
        })
    }

    @Action(SetTopicStatus)
    setTopicStatus({getState, setState}: StateContext<TopicStateModel>, {payload}: SetTopicStatus) {
        return new Promise((resolve, reject) => {
            this.topicService.setStatus(payload)
                .subscribe(() => {
                }, reject)
        })
    }
}
