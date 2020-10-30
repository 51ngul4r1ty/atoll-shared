// actions
import { BacklogItem } from "../types/backlogItemTypes";
import * as ActionTypes from "./actionTypes";

let lastInstanceId = 0;

export interface MoveSelectedBacklogItemsToSprintUsingApiActionPayload {
    sprintId: string;
    instanceId: number;
}

export interface MoveSelectedBacklogItemsToSprintUsingApiAction {
    type: typeof ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT;
    payload: MoveSelectedBacklogItemsToSprintUsingApiActionPayload;
}

export const moveSelectedBacklogItemsToSprintUsingApi = (sprintId: string): MoveSelectedBacklogItemsToSprintUsingApiAction => ({
    type: ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT,
    payload: {
        sprintId,
        instanceId: ++lastInstanceId
    }
});

export interface MoveBacklogItemToSprintActionPayload {
    sprintId: string;
    backlogItem: BacklogItem;
}

export interface MoveBacklogItemToSprintAction {
    type: typeof ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT;
    payload: MoveBacklogItemToSprintActionPayload;
}

export const moveBacklogItemToSprint = (sprintId: string, backlogItem: BacklogItem) => ({
    type: ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT,
    payload: {
        sprintId,
        backlogItem
    }
});
