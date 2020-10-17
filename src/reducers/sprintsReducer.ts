// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA, StandardModelItem } from "../types";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiSprint } from "../apiModelTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

export interface Sprint extends StandardModelItem {
    name: string;
    displayindex: number;
    startdate: Date;
    finishdate: Date;
    projectId: string;
}

export type SprintsState = Readonly<{
    items: Sprint[];
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
    items: []
});

export const mapApiItemToSprint = (apiItem: ApiSprint): Sprint => ({
    id: apiItem.id,
    name: apiItem.name,
    displayindex: apiItem.displayindex,
    startdate: isoDateStringToDate(apiItem.startdate),
    finishdate: isoDateStringToDate(apiItem.finishdate),
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    projectId: apiItem.projectId
});

export const mapApiItemsToSprints = (apiItems: ApiSprint[]): Sprint[] => {
    return apiItems.map((item) => mapApiItemToSprint(item));
};

export const sprintsReducer = (state: SprintsState = sprintsReducerInitialState, action: AnyFSA): SprintsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            // case ActionTypes.API_GET_SPRINTS_SUCCESS: {
            //     const actionTyped = action as ApiGetSprintsSuccessAction;
            //     const { payload } = actionTyped;
            //     draft.items = mapApiItemsToSprints(payload.response.data.items);
            //     draft.pushedItems = [];
            //     draft.addedItems = [];
            //     rebuildAllItems(draft);
            //     return;
            // }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToSprints(payload.response.data.sprints);
                return;
            }
        }
    });
