// actions
import * as ActionTypes from "./actionTypes";

// interfaces/types
import { BacklogItem } from "../types/backlogItemTypes";

export interface MoveSelectedBacklogItemsToSprintUsingApiActionPayload {
    sprintId: string;
}

export interface MoveSelectedBacklogItemsToSprintUsingApiAction {
    type: typeof ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT;
    payload: MoveSelectedBacklogItemsToSprintUsingApiActionPayload;
}

export const moveSelectedBacklogItemsToSprintUsingApi = (sprintId: string): MoveSelectedBacklogItemsToSprintUsingApiAction => ({
    type: ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT,
    payload: {
        sprintId
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
    backlogItemId: string;
}

export interface ToggleSprintBacklogItemDetailAction {
    type: typeof ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL;
    payload: ToggleSprintBacklogItemDetailPayload;
}

export const sprintBacklogItemDetailClicked = (sprintId, backlogItemId: string): ToggleSprintBacklogItemDetailAction => ({
    type: ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL,
    payload: {
        sprintId,
        backlogItemId
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

export interface SprintBacklogItemDoneClickedPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintBacklogItemDoneClickedAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICKED;
    payload: SprintBacklogItemDoneClickedPayload;
}

export const sprintBacklogItemDoneClicked = (sprintId: string, backlogItemId: string): SprintBacklogItemDoneClickedAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICKED,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemInProgressClickedPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintBacklogItemInProgressClickedAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICKED;
    payload: SprintBacklogItemInProgressClickedPayload;
}

export const sprintBacklogItemInProgressClicked = (
    sprintId: string,
    backlogItemId: string
): SprintBacklogItemInProgressClickedAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICKED,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemNotStartedClickedPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintBacklogItemNotStartedClickedAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICKED;
    payload: SprintBacklogItemNotStartedClickedPayload;
}

export const sprintBacklogItemNotStartedClicked = (
    sprintId: string,
    backlogItemId: string
): SprintBacklogItemNotStartedClickedAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICKED,
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

export const removeSprintBacklogItem = (sprintId: string, backlogItemId: string): RemoveSprintBacklogItemAction => ({
    type: ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface ChangeSprintPlanningArchivedFilterActionPayload {
    includeArchived: boolean;
}

export interface ChangeSprintPlanningArchivedFilterAction {
    type: typeof ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER;
    payload: ChangeSprintPlanningArchivedFilterActionPayload;
}

export const changeSprintPlanningArchivedFilter = (includeArchived: boolean): ChangeSprintPlanningArchivedFilterAction => ({
    type: ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER,
    payload: {
        includeArchived
    }
});
