// externals
import { Action, Store } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// selectors
import { getBacklogItemByInstanceId } from "../selectors/backlogItemSelectors";

// actions
import { postBacklogItem, SaveBacklogItemAction } from "../actions/backlogItems";

// state
import { StateTree } from "../types";

// utils
import { convertToBacklogItemModel } from "../utils/apiPayloadHelper";

export const apiOrchestrationMiddleware = (store) => (next) => (action: Action) => {
    const storeToUse = store as Store<StateTree>;
    next(action);
    switch (action.type) {
        case ActionTypes.SAVE_BACKLOG_ITEM:
            const actionTyped = action as SaveBacklogItemAction;
            const state = storeToUse.getState();
            const instanceId = actionTyped.payload.instanceId;
            const backlogItem = getBacklogItemByInstanceId(state, instanceId);
            if (backlogItem) {
                const model = convertToBacklogItemModel(backlogItem);
                storeToUse.dispatch(postBacklogItem(model, { instanceId }));
            }
            break;
    }
};
