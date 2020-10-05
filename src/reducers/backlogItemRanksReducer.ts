// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA, BaseModelItem } from "../types";
import { ApiBacklogItemRank } from "../apiModelTypes";
import { ApiGetBacklogItemRanksSuccessAction } from "../actions/apiBacklogItemRanks";

export type BacklogItemType = "story" | "issue";

export enum PushState {
    None,
    Changed,
    Removed
}

export interface BacklogItemRank extends BaseModelItem {
    id: string;
    projectId: string | null;
    backlogItemId: string | null;
    nextBacklogItemId: string | null;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

export type BacklogItemRanksState = Readonly<{
    items: BacklogItemRank[];
}>;

export const backlogItemRanksReducerInitialState = Object.freeze<BacklogItemRanksState>({
    items: []
});

export const mapApiItemToBacklogItemRank = (apiItem: ApiBacklogItemRank): BacklogItemRank => ({
    id: apiItem.id,
    projectId: apiItem.projectId,
    backlogItemId: apiItem.backlogitemId,
    nextBacklogItemId: apiItem.nextbacklogitemId,
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    version: apiItem.version
});

export const mapApiItemsToBacklogItemRanks = (apiItems: ApiBacklogItemRank[]): BacklogItemRank[] => {
    return apiItems.map((item) => mapApiItemToBacklogItemRank(item));
};

export const backlogItemRanksReducer = (
    state: BacklogItemRanksState = backlogItemRanksReducerInitialState,
    action: AnyFSA
): BacklogItemRanksState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEM_RANKS_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemRanksSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToBacklogItemRanks(payload.response.data.items);
                return;
            }
        }
    });