// TODO: Add comments at top of this file to explain what its responsibility is.

// externals
import { Action, Store } from "redux";

// selectors
import { getBacklogItemById } from "../selectors/backlogItemSelectors";
import { getFirstSprint, getLastSprint, getNextSprint } from "../selectors/sprintSelectors";
import { getCurrentProjectId } from "../selectors/userSelectors";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import {
    ApiPostSprintBacklogItemSuccessAction,
    ApiSplitSprintItemSuccessAction,
    ApiSprintBacklogItemSetStatusSuccessAction
} from "../actions/apiSprintBacklog";
import { SaveableSprint } from "../reducers/sprintsReducer";

// state
import { StateTree } from "../reducers/rootReducer";

// actions
import { addBacklogItemToSprint, moveBacklogItemToSprint } from "../actions/sprintBacklogActions";
import { AddNewSprintFormAction, addSprint, NewSprintPosition, updateSprintStats } from "../actions/sprintActions";

// utils
import { DateOnly } from "../types/dateTypes";
import { timeNow } from "../utils/dateHelper";
import { BacklogItem } from "../types/backlogItemTypes";
import { mapApiItemToBacklogItem, mapApiStatusToBacklogItem } from "../mappers/backlogItemMappers";

export const sprintBacklogItemMiddleware = (store) => (next) => (action: Action) => {
    next(action);
    const storeTyped = store as Store<StateTree>;
    switch (action.type) {
        case ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiSprintBacklogItemSetStatusSuccessAction;
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
            const sprintId = payloadData?.item?.sprintId;
            if (!sprintId) {
                throw Error("Invalid response from server - sprintId should be returned when adding sprint backlog item");
            }
            const backlogItemPartId = actionTyped.payload.response?.data?.item?.backlogitempartId;
            if (!backlogItemPartId) {
                throw Error("Invalid response from server - backlogItemPartId should be returned when adding sprint backlog item");
            }
            const backlogItemId = actionTyped.meta.actionParams.backlogItemId;
            if (!backlogItemId) {
                throw Error("Invalid action data - actionParams should contain backlogItemId");
            }
            const backlogItem = getBacklogItemById(state, backlogItemId);
            if (!backlogItem) {
                throw new Error(`Unable to find backlog item with ID ${backlogItemId}`);
            }
            const payloadBacklogItem: BacklogItem = {
                ...backlogItem,
                estimate: payloadData?.extra?.backlogItemPart?.points,
                partIndex: payloadData?.extra?.backlogItemPart?.partIndex,
                totalParts: payloadData?.extra?.backlogItem?.totalParts,
                storyEstimate: payloadData?.extra?.backlogItem?.estimate
            };
            // BUSY HERE: Look at how moveBacklogItemToSprint is done and do something similar for addBacklogItemToSprint
            storeTyped.dispatch(moveBacklogItemToSprint(sprintId, payloadBacklogItem));
            const response = actionTyped.payload.response;
            const sprintStats = response.data.extra?.sprintStats;
            if (sprintStats) {
                storeTyped.dispatch(updateSprintStats(sprintId, sprintStats));
            }

            return;
        }
        case ActionTypes.API_ADD_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
            const state = storeTyped.getState();
            // TODO: Use this same action to hide the menu with "Split To Next Sprint" in it
            // TODO: Use this same action to stop the spinner on the Split to Next Sprint button (need to build this still - create story??)
            const actionTyped = action as ApiSplitSprintItemSuccessAction;
            const nextSprint = getNextSprint(state, actionTyped.meta.actionParams.sprintId);
            if (nextSprint) {
                const backlogItem = mapApiItemToBacklogItem(actionTyped.payload.response.data.extra.backlogItem);
                const backlogItemPart = actionTyped.payload.response.data.item;
                const backlogItemWithPartInfo = {
                    ...backlogItem,
                    estimate: backlogItemPart.points,
                    storyEstimate: backlogItem.estimate,
                    totalParts: backlogItem.totalParts + 1,
                    partIndex: backlogItemPart.partIndex,
                    status: mapApiStatusToBacklogItem(backlogItemPart.status)
                };
                storeTyped.dispatch(addBacklogItemToSprint(nextSprint.id, backlogItemWithPartInfo));
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
                const firstSprint = getFirstSprint(state);
                startDate = firstSprint.startDate.addDays(-(SPRINT_DAY_LENGTH - 1));
                finishDate = firstSprint.startDate;
            } else if (position === NewSprintPosition.After) {
                const lastSprint = getLastSprint(state);
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
                projectId: getCurrentProjectId(state),
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
    }
};
