// actions
import { BacklogItem } from "../types/backlogItemTypes";
import * as ActionTypes from "./actionTypes";

// let lastInstanceId = 0;

export interface MoveSelectedBacklogItemsToSprintUsingApiActionPayload {
    sprintId: string;
    //    instanceId: number;
}

export interface MoveSelectedBacklogItemsToSprintUsingApiAction {
    type: typeof ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT;
    payload: MoveSelectedBacklogItemsToSprintUsingApiActionPayload;
}

export const moveSelectedBacklogItemsToSprintUsingApi = (sprintId: string): MoveSelectedBacklogItemsToSprintUsingApiAction => ({
    type: ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT,
    payload: {
        sprintId //,
        //        instanceId: ++lastInstanceId
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

export interface ToggleSprintBacklogItemDetailPayload {
    sprintId: string;
    itemId: string;
}

export interface ToggleSprintBacklogItemDetailAction {
    type: typeof ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL;
    payload: ToggleSprintBacklogItemDetailPayload;
}

export const sprintBacklogItemDetailClicked = (sprintId, backlogItemId: string): ToggleSprintBacklogItemDetailAction => ({
    type: ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL,
    payload: {
        sprintId,
        // TODO: Change itemId to backlogItemId
        itemId: backlogItemId
    }
});

export interface SprintMoveItemToBacklogClickedPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintMoveItemToBacklogClickedAction {
    type: typeof ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICKED;
    payload: SprintMoveItemToBacklogClickedPayload;
}

export const sprintMoveItemToBacklogClicked = (sprintId: string, backlogItemId: string): SprintMoveItemToBacklogClickedAction => ({
    type: ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICKED,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface RemoveSprintBacklogItemActionPayload {
    sprintId: string;
    backlogItemId: string;
}
export interface RemoveSprintBacklogItemAction {
    type: typeof ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM;
    payload: RemoveSprintBacklogItemActionPayload;
}

export const removeSprintBacklogItem = (sprintId: string, backlogItemId: string) => ({
    type: ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM,
    payload: {
        sprintId,
        backlogItemId
    }
});

export enum NewSprintPosition {
    None = 0,
    Before = 1,
    After = 2
}

let lastInstanceId = 0;

export interface AddNewSprintFormActionPayload {
    instanceId: number;
    position: NewSprintPosition;
}
export interface AddNewSprintFormAction {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM_FORM;
    payload: AddNewSprintFormActionPayload;
}
export const addNewSprintForm = (position: NewSprintPosition): AddNewSprintFormAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEM_FORM,
    payload: {
        instanceId: ++lastInstanceId,
        position
    }
});
