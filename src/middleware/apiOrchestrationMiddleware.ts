// externals
import { Action, Store } from "redux";
import * as HttpStatus from "http-status-codes";

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
import { postLogin, ActionPostLoginSuccessAction, ActionPostRefreshTokenSuccessAction } from "../actions/authActions";

// state
import { StateTree } from "../types";

// utils
import { convertToBacklogItemModel } from "../utils/apiPayloadHelper";
import { routePlanView } from "../actions/routeActions";

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
            const state = storeTyped.getState();
            storeTyped.dispatch(postLogin(state.app.username, state.app.password));
            break;
        }
        case ActionTypes.API_POST_ACTION_LOGIN_SUCCESS: {
            const actionTyped = action as ActionPostLoginSuccessAction;
            if (actionTyped.payload.response.status === HttpStatus.OK) {
                storeTyped.dispatch(routePlanView());
            }
            break;
        }
        case ActionTypes.API_POST_ACTION_RETRY_TOKEN_SUCCESS: {
            const actionTyped = action as ActionPostRefreshTokenSuccessAction;
            if (actionTyped.payload.response.status === HttpStatus.OK) {
                const apiAction = actionTyped.meta.passthrough.actionToRetry;
                storeTyped.dispatch(apiAction);
            }
            break;
        }
    }
};
