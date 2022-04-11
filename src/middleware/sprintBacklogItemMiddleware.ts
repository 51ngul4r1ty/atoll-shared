/**
 * Purpose: Handle updates to UI state for Sprint Backlog Items.
 * Reason to change: When Sprint Backlog Item UI state is more complex than simple state updates (for example, involves API calls).
 */

// externals
import type { Store } from "redux";

// selectors
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";
import * as sprintSelectors from "../selectors/sprintSelectors";
import * as userSelectors from "../selectors/userSelectors";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import type { AnyFSA } from "../types/reactHelperTypes";
import type { ApiGetSprintSuccessAction } from "../actions/apiSprints";
import type {
    ApiGetSprintBacklogItemsSuccessAction,
    ApiPostSprintBacklogItemSuccessAction,
    ApiSplitSprintItemSuccessAction
} from "../actions/apiSprintBacklog";
import type { SaveableSprint } from "../reducers/sprintsReducer";

// state
import type { StateTree } from "../reducers/rootReducer";

// actions
import {
    addBacklogItemToSprint,
    moveBacklogItemToSprint,
    patchBacklogItemInSprint,
    SprintBacklogItemDetailClickAction
} from "../actions/sprintBacklogActions";
import { AddNewSprintFormAction, addSprint, NewSprintPosition, updateSprintStats } from "../actions/sprintActions";

// utils
import { DateOnly } from "../types/dateTypes";
import { timeNow } from "../utils/dateHelper";
import { BacklogItemInSprint } from "../types/backlogItemTypes";
import { mapApiItemToBacklogItem } from "../mappers/backlogItemMappers";
import { mapApiItemToBacklogItemPart } from "../mappers/backlogItemPartMappers";
import { removeProductBacklogItem, SelectProductBacklogItemAction } from "../actions/backlogItemActions";
import {
    handleGetSprintBacklogItemsSuccessForItemDetailClick,
    handleGetSprintSuccessForItemDetailClick,
    handleSprintBacklogItemDetailClick
} from "../actionFlows/itemDetailMenuActionFlow";
import { getFlowInfoFromAction } from "../utils/actionFlowUtils";
import { apiGetBacklogItem } from "../actions/apiBacklogItems";

export const sprintBacklogItemMiddleware = (store) => (next) => (action: AnyFSA) => {
    next(action);
    const storeTyped = store as Store<StateTree>;
    switch (action.type) {
        case ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiPostSprintBacklogItemSuccessAction;
            const sprintId = actionTyped.meta.actionParams.sprintId;
            const response = actionTyped.payload.response;
            const sprintStats = response.data.extra?.sprintStats;
            if (sprintStats) {
                storeTyped.dispatch(updateSprintStats(sprintId, sprintStats));
            }
            return;
        }
        case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS: {
            const state = storeTyped.getState();
            const actionTyped = action as ApiPostSprintBacklogItemSuccessAction;
            const payloadData = actionTyped.payload.response?.data;
            const actionParams = actionTyped.meta.actionParams;
            const response = actionTyped.payload.response;

            const sprintId = actionParams.sprintId;
            if (!sprintId) {
                throw Error(
                    "Invalid response from server - sprintId should be available in meta.actionParams adding sprint backlog item"
                );
            }

            const backlogItemId = actionParams.backlogItemId;
            if (!backlogItemId) {
                throw Error("Invalid action data - actionParams should contain backlogItemId");
            }

            const backlogItem = backlogItemSelectors.selectBacklogItemById(state, backlogItemId);
            if (!backlogItem) {
                throw new Error(`Unable to find backlog item with ID ${backlogItemId}`);
            }

            const item = response?.data?.item;
            const dataExtraBacklogItemPart = mapApiItemToBacklogItemPart(payloadData?.extra?.backlogItemPart);
            const dataExtraBacklogItem = mapApiItemToBacklogItem(payloadData?.extra?.backlogItem);

            if (!item) {
                // this will occur when a split item is added back into a sprint at it gets "absorbed" into the
                // other part that is already present
                storeTyped.dispatch(
                    patchBacklogItemInSprint(sprintId, backlogItemId, {
                        totalParts: dataExtraBacklogItem.totalParts
                    })
                );
                storeTyped.dispatch(removeProductBacklogItem(backlogItemId));
            } else {
                const backlogItemPartId = item?.backlogitempartId;
                if (!backlogItemPartId) {
                    throw Error(
                        "Invalid response from server - backlogItemPartId should be returned when adding sprint backlog item"
                    );
                }
                const payloadBacklogItem: BacklogItemInSprint = {
                    ...backlogItem,
                    estimate: dataExtraBacklogItemPart?.points,
                    partIndex: dataExtraBacklogItemPart?.partIndex,
                    totalParts: dataExtraBacklogItem?.totalParts,
                    storyEstimate: dataExtraBacklogItem?.estimate,
                    backlogItemPartId: dataExtraBacklogItemPart?.id, // TODO: Check this
                    displayindex: payloadData?.item.displayindex, // TODO: Check this
                    partPercentage: dataExtraBacklogItemPart?.percentage,
                    storyStatus: dataExtraBacklogItem?.status,
                    storyStartedAt: dataExtraBacklogItem?.startedAt,
                    storyUpdatedAt: dataExtraBacklogItem?.updatedAt,
                    storyFinishedAt: dataExtraBacklogItem?.finishedAt,
                    storyVersion: dataExtraBacklogItem?.version
                };
                storeTyped.dispatch(moveBacklogItemToSprint(sprintId, payloadBacklogItem, dataExtraBacklogItem));
                const sprintStats = response.data.extra?.sprintStats;
                if (sprintStats) {
                    storeTyped.dispatch(updateSprintStats(sprintId, sprintStats));
                }
            }
            return;
        }
        case ActionTypes.API_ADD_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
            const state = storeTyped.getState();
            const actionTyped = action as ApiSplitSprintItemSuccessAction;
            const currentSprintId = actionTyped.meta.actionParams.sprintId;
            const currentBacklogItemId = actionTyped.meta.actionParams.backlogItemId;
            const nextSprint = sprintSelectors.getNextSprint(state, currentSprintId);
            if (nextSprint) {
                const responseBacklogItem = mapApiItemToBacklogItem(actionTyped.payload.response.data.extra.backlogItem);
                const responseBacklogItemPart = mapApiItemToBacklogItemPart(actionTyped.payload.response.data.item);
                const storyEstimate = responseBacklogItem.estimate;
                const totalParts = responseBacklogItem.totalParts;
                const backlogItemWithPartInfo: BacklogItemInSprint = {
                    ...responseBacklogItem,
                    estimate: responseBacklogItemPart.points,
                    startedAt: responseBacklogItemPart.startedAt,
                    storyEstimate,
                    totalParts,
                    partIndex: responseBacklogItemPart.partIndex,
                    status: responseBacklogItemPart.status,
                    backlogItemPartId: responseBacklogItemPart.id,
                    displayindex: null, // TODO: Find out if I need to assign this??
                    partPercentage: responseBacklogItemPart.percentage,
                    storyStatus: responseBacklogItem.status,
                    storyStartedAt: responseBacklogItem.startedAt,
                    storyUpdatedAt: responseBacklogItem.updatedAt,
                    storyFinishedAt: responseBacklogItem.finishedAt,
                    storyVersion: responseBacklogItem.version
                };
                storeTyped.dispatch(addBacklogItemToSprint(nextSprint.id, backlogItemWithPartInfo));
                storeTyped.dispatch(patchBacklogItemInSprint(currentSprintId, currentBacklogItemId, { storyEstimate, totalParts }));
            }
            return;
        }
        case ActionTypes.ADD_SPRINT_FORM: {
            const state = storeTyped.getState();
            const actionTyped = action as AddNewSprintFormAction;
            const position = actionTyped.payload.position;
            let startDate: DateOnly;
            let finishDate: DateOnly;
            // TODO: Make this configurable (create a story for this)
            const SPRINT_DAY_LENGTH = 14;
            if (position === NewSprintPosition.Before) {
                const firstSprint = sprintSelectors.getFirstSprint(state);
                startDate = firstSprint.startDate.addDays(-(SPRINT_DAY_LENGTH - 1));
                finishDate = firstSprint.startDate;
            } else if (position === NewSprintPosition.After) {
                const lastSprint = sprintSelectors.getLastSprint(state);
                startDate = lastSprint.finishDate.addDays(1);
                finishDate = lastSprint.finishDate.addDays(SPRINT_DAY_LENGTH);
            } else {
                throw Error(`Unexpected ${position}`);
            }

            const newItem: SaveableSprint = {
                id: null,
                archived: false,
                name: "New Sprint", // TODO: Add story to configure a default formatting rule?
                startDate,
                finishDate,
                instanceId: actionTyped.payload.instanceId,
                projectId: userSelectors.getCurrentProjectId(state),
                plannedPoints: 0,
                acceptedPoints: 0,
                velocityPoints: 0,
                usedSplitPoints: 0,
                remainingSplitPoints: 0,
                totalPoints: 0,
                backlogItemsLoaded: true,
                expanded: true,
                createdAt: timeNow(),
                updatedAt: timeNow(),
                saved: false
            };
            storeTyped.dispatch(addSprint(newItem, position));
            return;
        }
        case ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK: {
            const actionTyped = action as SprintBacklogItemDetailClickAction;
            const actionType = action.type;
            const sprintId = actionTyped.payload.sprintId;
            const backlogItemId = actionTyped.payload.backlogItemId;
            handleSprintBacklogItemDetailClick(storeTyped, actionType, sprintId, backlogItemId);
            return;
        }
        case ActionTypes.API_GET_SPRINT_SUCCESS: {
            const actionTyped = action as ApiGetSprintSuccessAction;
            const payload = actionTyped.payload;
            const meta = actionTyped.meta;
            const { triggerAction, stepName } = getFlowInfoFromAction(actionTyped);
            if (triggerAction !== ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                throw new Error("Unexpected result- SPRINT_BACKLOG_ITEM_DETAIL_CLICK expected as passthrough.triggerAction");
            } else {
                handleGetSprintSuccessForItemDetailClick(storeTyped, stepName, payload, meta);
            }
            return;
        }
        case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
            const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
            const meta = actionTyped.meta;
            const { triggerAction, stepName } = getFlowInfoFromAction(actionTyped);
            if (triggerAction === ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                const apiBacklogItems = actionTyped.payload.response.data.items;
                const sprintId = meta.passthrough.sprintId;
                const backlogItemId = meta?.passthrough?.backlogItemId || null;
                handleGetSprintBacklogItemsSuccessForItemDetailClick(
                    storeTyped,
                    stepName,
                    apiBacklogItems,
                    sprintId,
                    backlogItemId
                );
            }
            return;
        }
        // TODO: Move this to the "product backlog middleware" (needs to be created still)
        case ActionTypes.SELECT_PRODUCT_BACKLOG_ITEM: {
            const actionTyped = action as SelectProductBacklogItemAction;
            const backlogItemId = actionTyped.payload.itemId;
            storeTyped.dispatch(
                apiGetBacklogItem(backlogItemId, {
                    passthroughData: {
                        triggerAction: actionTyped.type,
                        backlogItemId
                    }
                })
            );
            return;
        }
        // TODO: Move this to the "product backlog middleware" (needs to be created still)
        case ActionTypes.UNSELECT_PRODUCT_BACKLOG_ITEM: {
            const actionTyped = action as SelectProductBacklogItemAction;
            const backlogItemId = actionTyped.payload.itemId;
            storeTyped.dispatch(
                apiGetBacklogItem(backlogItemId, {
                    passthroughData: {
                        triggerAction: actionTyped.type,
                        backlogItemId
                    }
                })
            );
            return;
        }
    }
};
