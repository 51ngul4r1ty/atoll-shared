// externals
import { Action, Store } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// selectors
import { getBacklogItemByInstanceId, getPrevSavedBacklogItemByInstanceId } from "../selectors/backlogItemSelectors";

// actions
import {
    postBacklogItem,
    SaveBacklogItemAction,
    ReorderBacklogItemAction,
    postActionBacklogItemReorder,
    refreshBacklogItems
} from "../actions/backlogItems";

// state
import { StateTree } from "../types";

// utils
import { convertToBacklogItemModel } from "../utils/apiPayloadHelper";

export const apiOrchestrationMiddleware = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    switch (action.type) {
        case ActionTypes.SAVE_BACKLOG_ITEM: {
            const actionTyped = action as SaveBacklogItemAction;
            const state = storeTyped.getState();
            const instanceId = actionTyped.payload.instanceId;
            const backlogItem = getBacklogItemByInstanceId(state, instanceId);
            const prevBacklogItem = getPrevSavedBacklogItemByInstanceId(state, instanceId);
            if (backlogItem) {
                const prevItemId = prevBacklogItem ? prevBacklogItem.id : null;
                const model = convertToBacklogItemModel(backlogItem);
                storeTyped.dispatch(postBacklogItem(model, prevItemId, { instanceId }));
            }
            break;
        }
        case ActionTypes.REORDER_BACKLOG_ITEM: {
            const actionTyped = action as ReorderBacklogItemAction;
            storeTyped.dispatch(postActionBacklogItemReorder(actionTyped.payload.sourceItemId, actionTyped.payload.targetItemId));
            break;
        }
        case ActionTypes.API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS: {
            storeTyped.dispatch(refreshBacklogItems());
            break;
        }
        case ActionTypes.LOGIN_USER: {
            // TODO: Finish this up
            console.log("NEED TO MAKE API CALL HERE");
            break;
        }
    }
};
