/**
 * Purpose: To determine when to make RESTful API calls based on actions that occur.
 * Reason to change: When new RESTful API calls are needed.
 */

// externals
import type { Action, Middleware } from "redux";
import { push } from "connected-react-router";
import { StatusCodes } from "http-status-codes";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { BacklogItemStatus } from "../types/backlogItemEnums";
import { EditMode } from "../components/common/componentEnums";
import { ResourceTypes } from "../reducers/apiLinksReducer";

// interfaces/types
import type { BacklogItemPart } from "../types/backlogItemPartTypes";
import type { CancelEditBacklogItemPartAction, UpdateBacklogItemPartAction } from "../actions/backlogItemPartActions";
import type { ExpandSprintPanelAction, SaveNewSprintAction, UpdateSprintAction } from "../actions/sprintActions";
import type { StateTree } from "../reducers/rootReducer";
import type { StoreTyped } from "../types/reduxHelperTypes";

// actions
import {
    apiPutBacklogItem,
    apiPostBacklogItem,
    apiPostActionBacklogItemReorder,
    apiGetBacklogItem,
    PutBacklogItemCallReason,
    ApiPutBacklogItemSuccessAction
} from "../actions/apiBacklogItems";
import {
    addProductBacklogItem,
    refreshBacklogItems,
    BacklogItemIdClickAction,
    CancelEditBacklogItemAction,
    ReorderBacklogItemAction,
    SaveNewBacklogItemAction,
    UpdateBacklogItemAction
} from "../actions/backlogItemActions";
import { postLogin, ActionPostLoginSuccessAction, ActionPostRefreshTokenSuccessAction } from "../actions/authActions";
import { routeLoginPage, routePlanView, routeTo } from "../actions/routeActions";
import { apiGetUserPreferences, ActionGetUserPrefsSuccessAction, GetUserPrefsCallReason } from "../actions/apiUserActions";
import {
    apiBatchAddBacklogItemsToSprint,
    apiGetSprintBacklogItems,
    apiMoveSprintItemToProductBacklog,
    apiSprintBacklogItemSetStatus,
    ApiMoveSprintItemToProductBacklogSuccessAction,
    apiSplitSprintBacklogItem
} from "../actions/apiSprintBacklog";
import {
    removeSprintBacklogItem,
    ChangeSprintPlanningArchivedFilterAction,
    MoveSelectedBacklogItemsToSprintUsingApiAction,
    SprintBacklogItemAcceptedClickAction,
    SprintBacklogItemDoneClickAction,
    SprintBacklogItemIdClickAction,
    SprintBacklogItemInProgressClickAction,
    SprintBacklogItemNotStartedClickAction,
    SprintBacklogItemReleasedClickAction,
    SprintMoveItemToBacklogClickAction,
    SprintSplitBacklogItemClickAction
} from "../actions/sprintBacklogActions";
import { apiGetSprints, apiPostSprint, apiPutSprint } from "../actions/apiSprints";
import { clearPostLoginReturnRoute, setEditMode } from "../actions/appActions";
import { updateSprintStats } from "../actions/sprintActions";

// selectors
import * as apiSelectors from "../selectors/apiSelectors";
import * as appSelectors from "../selectors/appSelectors";
import * as backlogItemPartSelectors from "../selectors/backlogItemPartSelectors";
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";
import * as userSelectors from "../selectors/userSelectors";
import * as sprintSelectors from "../selectors/sprintSelectors";
import * as sprintBacklogSelectors from "../selectors/sprintBacklogSelectors";

// utils
import { apiGetBacklogItemPart, apiPatchBacklogItemPart } from "../actions/apiBacklogItemParts";
import {
    apiGetProject,
    ApiGetProjectRouteToBacklogItemViewMeta,
    ApiGetProjectSuccessRouteToBacklogItemViewAction
} from "../actions/apiProjects";
import { buildBacklogDisplayId } from "../utils/backlogItemHelper";
import { convertToBacklogItemModel, convertToSprintModel } from "../utils/apiPayloadHelper";
import { encodeForUrl } from "../utils/urlUtils";

export const apiOrchestrationMiddleware: Middleware<{}, StateTree> = (store: StoreTyped) => (next) => (action: Action) => {
    next(action);
    const state = store.getState();
    switch (action.type) {
        case ActionTypes.SAVE_NEW_BACKLOG_ITEM: {
            const actionTyped = action as SaveNewBacklogItemAction;
            const instanceId = actionTyped.payload.instanceId;
            const backlogItem = backlogItemSelectors.getBacklogItemByInstanceId(state, instanceId);
            const prevBacklogItem = backlogItemSelectors.getPrevSavedBacklogItemByInstanceId(state, instanceId);
            if (backlogItem) {
                const prevItemId = prevBacklogItem ? prevBacklogItem.id : null;
                const model = convertToBacklogItemModel(backlogItem);
                model.projectId = userSelectors.getCurrentProjectId(state);
                model.status = BacklogItemStatus.NotStarted;
                store.dispatch(apiPostBacklogItem(model, prevItemId, { instanceId }));
            }
            break;
        }
        case ActionTypes.REORDER_BACKLOG_ITEM: {
            const actionTyped = action as ReorderBacklogItemAction;
            store.dispatch(apiPostActionBacklogItemReorder(actionTyped.payload.sourceItemId, actionTyped.payload.targetItemId));
            break;
        }
        case ActionTypes.API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS: {
            const state = store.getState();
            const projectId = userSelectors.getCurrentProjectId(state);
            store.dispatch(refreshBacklogItems(projectId));
            break;
        }
        case ActionTypes.LOGIN_USER: {
            store.dispatch(postLogin(appSelectors.selectUserName(state), appSelectors.selectPassword(state)));
            break;
        }
        case ActionTypes.API_POST_ACTION_LOGIN_SUCCESS: {
            const actionTyped = action as ActionPostLoginSuccessAction;
            if (actionTyped.payload.response.status === StatusCodes.OK) {
                store.dispatch(apiGetUserPreferences(GetUserPrefsCallReason.LoginSuccess));
            }
            break;
        }
        case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
            const actionTyped = action as ActionGetUserPrefsSuccessAction;
            if (actionTyped.meta.passthrough.apiCallReason === GetUserPrefsCallReason.LoginSuccess) {
                const returnRoute = appSelectors.getPostLoginReturnRoute(state);
                if (returnRoute) {
                    store.dispatch(routeTo(returnRoute));
                    store.dispatch(clearPostLoginReturnRoute());
                } else {
                    store.dispatch(routePlanView());
                }
            }
            break;
        }
        // TODO: Maybe consider splitting this out to its own middleware, or keeping it here and moving other code out?
        case ActionTypes.API_POST_ACTION_RETRY_TOKEN_SUCCESS: {
            const actionTyped = action as ActionPostRefreshTokenSuccessAction;
            if (actionTyped.payload.response.status === StatusCodes.OK) {
                const apiAction = actionTyped.meta.passthrough.actionToRetry;
                store.dispatch(apiAction);
            }
            break;
        }
        case ActionTypes.INIT_APP: {
            store.dispatch(apiGetUserPreferences(GetUserPrefsCallReason.InitApp));
            break;
        }
        case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM: {
            const actionTyped = action as CancelEditBacklogItemAction;
            const itemId = actionTyped.payload.itemId;
            const payloadOverride = apiSelectors.buildApiPayloadBaseForResource(state, ResourceTypes.BACKLOG_ITEM, "item", itemId);
            store.dispatch(
                apiGetBacklogItem(itemId, {
                    payloadOverride
                })
            );
            break;
        }
        case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM_PART: {
            const actionTyped = action as CancelEditBacklogItemPartAction;
            const itemId = actionTyped.payload.itemId;
            const payloadOverride = apiSelectors.buildApiPayloadBaseForResource(
                state,
                ResourceTypes.BACKLOG_ITEM_PART,
                "item",
                itemId
            );
            store.dispatch(
                apiGetBacklogItemPart(itemId, {
                    payloadOverride
                })
            );
            break;
        }
        case ActionTypes.UPDATE_BACKLOG_ITEM: {
            const actionTyped = action as UpdateBacklogItemAction;
            const itemId = actionTyped.payload.id;

            const backlogItem = backlogItemSelectors.selectBacklogItemById(state, itemId);
            if (backlogItem) {
                const backlogItemModel = convertToBacklogItemModel(backlogItem);
                const payloadOverride = apiSelectors.buildApiPayloadBaseForResource(
                    state,
                    ResourceTypes.BACKLOG_ITEM,
                    "item",
                    itemId
                );
                store.dispatch(apiPutBacklogItem(backlogItemModel, payloadOverride));
            }
            break;
        }
        case ActionTypes.UPDATE_BACKLOG_ITEM_PART: {
            const actionTyped = action as UpdateBacklogItemPartAction;
            const itemId = actionTyped.payload.id;

            const fullBacklogItemPart = backlogItemPartSelectors.getBacklogItemPartById(state, itemId);
            if (fullBacklogItemPart) {
                const backlogItemPart: Partial<BacklogItemPart> = {
                    id: fullBacklogItemPart.id,
                    points: fullBacklogItemPart.points,
                    percentage: fullBacklogItemPart.percentage
                };
                const payloadOverride = apiSelectors.buildApiPayloadBaseForResource(
                    state,
                    ResourceTypes.BACKLOG_ITEM_PART,
                    "item",
                    itemId
                );
                store.dispatch(apiPatchBacklogItemPart(backlogItemPart, payloadOverride));
            }
            break;
        }
        case ActionTypes.SAVE_CURRENT_BACKLOG_ITEM: {
            const backlogItem = backlogItemSelectors.getCurrentBacklogItem(state);
            if (backlogItem) {
                const model = convertToBacklogItemModel(backlogItem);
                const apiCallReason = PutBacklogItemCallReason.SaveCurrentBacklogItem;
                const payloadOverride = apiSelectors.buildApiPayloadBaseForResource(
                    state,
                    ResourceTypes.BACKLOG_ITEM,
                    "item",
                    backlogItem.id
                );
                store.dispatch(apiPutBacklogItem(model, payloadOverride, apiCallReason));
            }
            break;
        }
        case ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiPutBacklogItemSuccessAction;
            if (actionTyped.meta.passthrough.apiCallReason === PutBacklogItemCallReason.SaveCurrentBacklogItem) {
                store.dispatch(setEditMode(EditMode.View));
            }
            break;
        }
        case ActionTypes.EXPAND_SPRINT_PANEL: {
            const actionTyped = action as ExpandSprintPanelAction;
            const sprintId = actionTyped.payload.sprintId;
            const sprint = sprintSelectors.getSprintById(state, sprintId);
            if (sprint && !sprint.backlogItemsLoaded) {
                store.dispatch(apiGetSprintBacklogItems(sprintId));
            }
            break;
        }
        case ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT: {
            const actionTyped = action as MoveSelectedBacklogItemsToSprintUsingApiAction;
            const sprintId = actionTyped.payload.sprintId;
            const selectedItems = backlogItemSelectors.getSelectedBacklogItemIds(state);
            store.dispatch(apiBatchAddBacklogItemsToSprint(sprintId, selectedItems));
            break;
        }
        case ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK: {
            const actionTyped = action as SprintMoveItemToBacklogClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            store.dispatch(apiMoveSprintItemToProductBacklog(sprintId, backlogItemId));
            break;
        }
        case ActionTypes.SPLIT_SPRINT_BACKLOG_ITEM_CLICK: {
            const actionTyped = action as SprintSplitBacklogItemClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            store.dispatch(apiSplitSprintBacklogItem(sprintId, backlogItemId));
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK: {
            const actionTyped = action as SprintBacklogItemAcceptedClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItemPartId = sprintBacklogSelectors.lookupPartIdForBacklogItemInSprint(state, sprintId, backlogItemId);
            store.dispatch(apiSprintBacklogItemSetStatus(sprintId, backlogItemPartId, BacklogItemStatus.Accepted));
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICK: {
            const actionTyped = action as SprintBacklogItemDoneClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItemPartId = sprintBacklogSelectors.lookupPartIdForBacklogItemInSprint(state, sprintId, backlogItemId);
            store.dispatch(apiSprintBacklogItemSetStatus(sprintId, backlogItemPartId, BacklogItemStatus.Done));
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICK: {
            const actionTyped = action as SprintBacklogItemInProgressClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItemPartId = sprintBacklogSelectors.lookupPartIdForBacklogItemInSprint(state, sprintId, backlogItemId);
            store.dispatch(apiSprintBacklogItemSetStatus(sprintId, backlogItemPartId, BacklogItemStatus.InProgress));
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICK: {
            const actionTyped = action as SprintBacklogItemNotStartedClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItemPartId = sprintBacklogSelectors.lookupPartIdForBacklogItemInSprint(state, sprintId, backlogItemId);
            store.dispatch(apiSprintBacklogItemSetStatus(sprintId, backlogItemPartId, BacklogItemStatus.NotStarted));
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_RELEASED_CLICK: {
            const actionTyped = action as SprintBacklogItemReleasedClickAction;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItemPartId = sprintBacklogSelectors.lookupPartIdForBacklogItemInSprint(state, sprintId, backlogItemId);
            store.dispatch(apiSprintBacklogItemSetStatus(sprintId, backlogItemPartId, BacklogItemStatus.Released));
            break;
        }
        case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiMoveSprintItemToProductBacklogSuccessAction;
            // default to 1 unallocated part because we're moving this into the backlog - so it can only be 1+
            const unallocatedParts = actionTyped.payload.response.data.extra?.backlogItem?.unallocatedParts || 1;
            const unallocatedPoints = actionTyped.payload.response.data.extra?.backlogItem?.unallocatedPoints || 1;
            const sprintId = actionTyped.meta.actionParams.sprintId;
            const backlogItemId = actionTyped.meta.actionParams.backlogItemId;
            const backlogItem = sprintBacklogSelectors.getSprintBacklogItemById(state, sprintId, backlogItemId);
            store.dispatch(addProductBacklogItem({ ...backlogItem, unallocatedParts, unallocatedPoints }));
            const response = actionTyped.payload.response;
            store.dispatch(removeSprintBacklogItem(sprintId, backlogItemId));
            const sprintStats = response.data.extra?.sprintStats;
            if (sprintStats) {
                store.dispatch(updateSprintStats(sprintId, sprintStats));
            }
            break;
        }
        case ActionTypes.SAVE_NEW_SPRINT: {
            const actionTyped = action as SaveNewSprintAction;
            const instanceId = actionTyped.payload.instanceId;
            const sprint = sprintSelectors.getSprintByInstanceId(state, instanceId);
            if (sprint) {
                const model = convertToSprintModel(sprint);
                model.projectId = userSelectors.getCurrentProjectId(state);
                store.dispatch(apiPostSprint(model, { instanceId }));
            }
            break;
        }
        case ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER: {
            const actionTyped = action as ChangeSprintPlanningArchivedFilterAction;
            const projectId = userSelectors.getCurrentProjectId(state);
            const includeArchived = actionTyped.payload.includeArchived;
            store.dispatch(apiGetSprints(projectId, includeArchived));
            break;
        }
        case ActionTypes.BACKLOG_ITEM_ID_CLICK: {
            const actionTyped = action as BacklogItemIdClickAction;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const backlogItem = backlogItemSelectors.selectBacklogItemById(state, backlogItemId);
            const projectId = backlogItem.projectId;
            const backlogItemDisplayId = buildBacklogDisplayId(backlogItem.externalId, backlogItem.friendlyId);
            store.dispatch(
                apiGetProject(projectId, {
                    routeToBacklogItemView: true,
                    backlogItemDisplayId
                } as ApiGetProjectRouteToBacklogItemViewMeta)
            );
            break;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_ID_CLICK: {
            const actionTyped = action as SprintBacklogItemIdClickAction;
            const backlogItemId = actionTyped.payload.backlogItemId;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItem = sprintBacklogSelectors.getSprintBacklogItemById(state, sprintId, backlogItemId);
            const projectId = backlogItem.projectId;
            const backlogItemDisplayId = buildBacklogDisplayId(backlogItem.externalId, backlogItem.friendlyId);
            store.dispatch(
                apiGetProject(projectId, {
                    routeToBacklogItemView: true,
                    backlogItemDisplayId
                } as ApiGetProjectRouteToBacklogItemViewMeta)
            );
            break;
        }
        case ActionTypes.API_GET_PROJECT_SUCCESS: {
            // TODO: Could probably improve this now that the "init" API call returns project and it will be stored in state
            // TODO: What to do about other views though- it seems that other views will need to retrieve project anyway...
            const actionTyped = action as ApiGetProjectSuccessRouteToBacklogItemViewAction;
            const metaPassthrough = actionTyped.meta.passthrough as ApiGetProjectRouteToBacklogItemViewMeta;
            if (metaPassthrough.routeToBacklogItemView) {
                const projectDisplayId = actionTyped.payload.response.data.item.name;
                const backlogItemDisplayId = metaPassthrough.backlogItemDisplayId;
                const basePath = `/project/${encodeForUrl(projectDisplayId)}`;
                const newRoute = `${basePath}/backlog-item/${encodeForUrl(backlogItemDisplayId)}`;
                store.dispatch(push(newRoute));
            }
            break;
        }
        case ActionTypes.UPDATE_SPRINT: {
            const actionTyped = action as UpdateSprintAction;
            const itemId = actionTyped.payload.id;

            const sprint = sprintSelectors.getSprintById(state, itemId);
            if (sprint) {
                const model = convertToSprintModel(sprint);
                store.dispatch(
                    apiPutSprint(model, apiSelectors.buildApiPayloadBaseForResource(state, ResourceTypes.SPRINT, "item", itemId))
                );
            }
            break;
        }
        case ActionTypes.API_POST_ACTION_RETRY_TOKEN_FAILURE: {
            store.dispatch(routeLoginPage());
            break;
        }
    }
};
