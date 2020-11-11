// TODO: Need to figure out what should go here and what should be split out into other middleware
//       (analysis of different categories of case statements below + look at sprintBacklogItemMiddleware)

/**
 * Purpose: To determine when to make RESTful API calls based on actions that occur.
 * Reason to change: When new RESTful API calls are needed.
 */

// externals
import { Action, Store } from "redux";
import * as HttpStatus from "http-status-codes";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// selectors
import {
    getBacklogItemByInstanceId,
    getPrevSavedBacklogItemByInstanceId,
    getBacklogItemById,
    getSelectedBacklogItemIds
} from "../selectors/backlogItemSelectors";

// actions
import {
    apiPutBacklogItem,
    apiPostBacklogItem,
    apiPostActionBacklogItemReorder,
    apiGetBacklogItem
} from "../actions/apiBacklogItems";
import {
    refreshBacklogItems,
    UpdateBacklogItemAction,
    SaveNewBacklogItemAction,
    ReorderBacklogItemAction,
    CancelEditBacklogItemAction,
    addProductBacklogItem
} from "../actions/backlogItemActions";
import { postLogin, ActionPostLoginSuccessAction, ActionPostRefreshTokenSuccessAction } from "../actions/authActions";
import { routePlanView } from "../actions/routeActions";
import { getUserPreferences, ActionGetUserPrefsSuccessAction } from "../actions/userActions";

// state
import { StateTree } from "../reducers/rootReducer";

// selectors
import { buildApiPayloadBaseForResource } from "../selectors/apiSelectors";
import { getCurrentProjectId } from "../selectors/userSelectors";
import { getSprintById, getSprintByInstanceId } from "../selectors/sprintSelectors";

// utils
import { convertToBacklogItemModel, convertToSprintModel } from "../utils/apiPayloadHelper";

// interfaces/types
import { ResourceTypes } from "../reducers/apiLinksReducer";
import { ExpandSprintPanelAction, SaveNewSprintAction, UpdateSprintAction } from "../actions/sprintActions";
import {
    apiBatchAddBacklogItemsToSprint,
    apiGetSprintBacklogItems,
    apiMoveSprintItemToProductBacklog,
    ApiMoveSprintItemToProductBacklogSuccessAction
} from "../actions/apiSprintBacklog";
import {
    MoveSelectedBacklogItemsToSprintUsingApiAction,
    removeSprintBacklogItem,
    SprintMoveItemToBacklogClickedAction
} from "../actions/sprintBacklogActions";
import { getSprintBacklogItemById } from "../selectors/sprintBacklogSelectors";
import { apiPostSprint } from "../actions/apiSprints";

export const apiOrchestrationMiddleware = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    switch (action.type) {
        case ActionTypes.SAVE_NEW_BACKLOG_ITEM: {
            const actionTyped = action as SaveNewBacklogItemAction;
            const state = storeTyped.getState();
            const instanceId = actionTyped.payload.instanceId;
            const backlogItem = getBacklogItemByInstanceId(state, instanceId);
            const prevBacklogItem = getPrevSavedBacklogItemByInstanceId(state, instanceId);
            if (backlogItem) {
                const prevItemId = prevBacklogItem ? prevBacklogItem.id : null;
                const model = convertToBacklogItemModel(backlogItem);
                model.projectId = getCurrentProjectId(state);
                storeTyped.dispatch(apiPostBacklogItem(model, prevItemId, { instanceId }));
            }
            break;
        }
        case ActionTypes.REORDER_BACKLOG_ITEM: {
            const actionTyped = action as ReorderBacklogItemAction;
            storeTyped.dispatch(
                apiPostActionBacklogItemReorder(actionTyped.payload.sourceItemId, actionTyped.payload.targetItemId)
            );
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
                storeTyped.dispatch(getUserPreferences(action.type));
            }
            break;
        }
        case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
            const actionTyped = action as ActionGetUserPrefsSuccessAction;
            if (actionTyped.meta.sourceActionType === ActionTypes.API_POST_ACTION_LOGIN_SUCCESS) {
                storeTyped.dispatch(routePlanView());
            }
            break;
        }
        // TODO: Maybe consider splitting this out to its own middleware, or keeping it here and moving other code out?
        case ActionTypes.API_POST_ACTION_RETRY_TOKEN_SUCCESS: {
            const actionTyped = action as ActionPostRefreshTokenSuccessAction;
            if (actionTyped.payload.response.status === HttpStatus.OK) {
                const apiAction = actionTyped.meta.passthrough.actionToRetry;
                storeTyped.dispatch(apiAction);
            }
            break;
        }
        case ActionTypes.INIT_APP: {
            storeTyped.dispatch(getUserPreferences());
            break;
        }
        case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM: {
            const actionTyped = action as CancelEditBacklogItemAction;
            const state = storeTyped.getState();
            const itemId = actionTyped.payload.itemId;
            storeTyped.dispatch(
                apiGetBacklogItem(itemId, buildApiPayloadBaseForResource(state, ResourceTypes.BACKLOG_ITEM, "item", itemId))
            );
            break;
        }
        case ActionTypes.UPDATE_BACKLOG_ITEM: {
            const actionTyped = action as UpdateBacklogItemAction;
            const state = storeTyped.getState();
            const itemId = actionTyped.payload.id;

            const backlogItem = getBacklogItemById(state, itemId);
            if (backlogItem) {
                const model = convertToBacklogItemModel(backlogItem);
                storeTyped.dispatch(
                    apiPutBacklogItem(model, buildApiPayloadBaseForResource(state, ResourceTypes.BACKLOG_ITEM, "item", itemId))
                );
            }
            break;
        }
        case ActionTypes.EXPAND_SPRINT_PANEL: {
            const actionTyped = action as ExpandSprintPanelAction;
            const state = storeTyped.getState();
            const sprintId = actionTyped.payload.sprintId;
            const sprint = getSprintById(state, sprintId);
            if (sprint && !sprint.backlogItemsLoaded) {
                storeTyped.dispatch(apiGetSprintBacklogItems(sprintId));
            }
            break;
        }
        case ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT: {
            const actionTyped = action as MoveSelectedBacklogItemsToSprintUsingApiAction;
            const state = storeTyped.getState();
            const sprintId = actionTyped.payload.sprintId;
            const selectedItems = getSelectedBacklogItemIds(state);
            storeTyped.dispatch(apiBatchAddBacklogItemsToSprint(sprintId, selectedItems));
            break;
        }
        case ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICKED: {
            const actionTyped = action as SprintMoveItemToBacklogClickedAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            storeTyped.dispatch(apiMoveSprintItemToProductBacklog(sprintId, backlogItemId));
            break;
        }
        case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiMoveSprintItemToProductBacklogSuccessAction;
            const sprintId = actionTyped.meta.actionParams.sprintId;
            const backlogItemId = actionTyped.meta.actionParams.backlogItemId;
            const state = storeTyped.getState();
            const backlogItem = getSprintBacklogItemById(state, sprintId, backlogItemId);
            storeTyped.dispatch(addProductBacklogItem(backlogItem));
            storeTyped.dispatch(removeSprintBacklogItem(sprintId, backlogItemId));
            break;
        }
        case ActionTypes.SAVE_NEW_SPRINT: {
            const actionTyped = action as SaveNewSprintAction;
            const state = storeTyped.getState();
            const instanceId = actionTyped.payload.instanceId;
            const sprint = getSprintByInstanceId(state, instanceId);
            if (sprint) {
                const model = convertToSprintModel(sprint);
                model.projectId = getCurrentProjectId(state);
                storeTyped.dispatch(apiPostSprint(model, { instanceId }));
            }
            break;
        }
        case ActionTypes.UPDATE_SPRINT: {
            // const actionTyped = action as UpdateSprintAction;
            // const state = storeTyped.getState();
            // const itemId = actionTyped.payload.id;

            // const sprint = getSprintById(state, itemId);
            // if (sprint) {
            //     const model = convertToSprintModel(sprint);
            //     storeTyped.dispatch(
            //         apiPutSprint(model, buildApiPayloadBaseForResource(state, ResourceTypes.SPRINT, "item", itemId))
            //     );
            // }
            break;
        }
    }
};
