// externals
import { Action, Store } from "redux";
import * as ActionTypes from "../actions/actionTypes";
import { getBacklogItemByInstanceId } from "../selectors/backlogItemSelectors";
import { postBacklogItem, SaveBacklogItemAction } from "../actions/backlogItems";
import { StateTree } from "../types";
import { convertToBacklogItemModel } from "../utils/apiPayloadHelper";

export const apiOrchestrationMiddleware = (store) => (next) => (action: Action) => {
    const storeToUse = store as Store<StateTree>;
    next(action);
    switch (action.type) {
        case ActionTypes.SAVE_BACKLOG_ITEM:
            const actionTyped = action as SaveBacklogItemAction;
            const state = storeToUse.getState();
            const backlogItem = getBacklogItemByInstanceId(state, actionTyped.payload.instanceId);
            if (backlogItem) {
                const model = convertToBacklogItemModel(backlogItem);
                storeToUse.dispatch(postBacklogItem(model));
            }
            break;
    }
};
