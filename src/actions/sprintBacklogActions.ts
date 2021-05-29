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

export interface AddOrMoveBacklogItemToSprintActionPayload {
    sprintId: string;
    backlogItem: BacklogItem;
}

export interface MoveBacklogItemToSprintAction {
    type: typeof ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT;
    payload: AddOrMoveBacklogItemToSprintActionPayload;
}

export const moveBacklogItemToSprint = (sprintId: string, backlogItem: BacklogItem): MoveBacklogItemToSprintAction => ({
    type: ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT,
    payload: {
        sprintId,
        backlogItem
    }
});

export interface AddBacklogItemToSprintAction {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT;
    payload: AddOrMoveBacklogItemToSprintActionPayload;
}

export const addBacklogItemToSprint = (sprintId: string, backlogItem: BacklogItem): AddBacklogItemToSprintAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT,
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

export const sprintBacklogItemDetailClick = (sprintId, backlogItemId: string): ToggleSprintBacklogItemDetailAction => ({
    type: ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintMoveItemToBacklogClickPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintMoveItemToBacklogClickAction {
    type: typeof ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK;
    payload: SprintMoveItemToBacklogClickPayload;
}

export const sprintMoveItemToBacklogClick = (sprintId: string, backlogItemId: string): SprintMoveItemToBacklogClickAction => ({
    type: ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintSplitBacklogItemClickPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintSplitBacklogItemClickAction {
    type: typeof ActionTypes.SPLIT_SPRINT_BACKLOG_ITEM_CLICK;
    payload: SprintSplitBacklogItemClickPayload;
}

export const sprintSplitBacklogItemClick = (sprintId: string, backlogItemId: string): SprintSplitBacklogItemClickAction => ({
    type: ActionTypes.SPLIT_SPRINT_BACKLOG_ITEM_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemStatusClickPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintBacklogItemAcceptedClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
}

export const sprintBacklogItemAcceptedClick = (sprintId: string, backlogItemId: string): SprintBacklogItemAcceptedClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemDoneClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
}

export const sprintBacklogItemDoneClick = (sprintId: string, backlogItemId: string): SprintBacklogItemDoneClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemInProgressClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
}

export const sprintBacklogItemInProgressClick = (
    sprintId: string,
    backlogItemId: string
): SprintBacklogItemInProgressClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemNotStartedClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
}

export const sprintBacklogItemNotStartedClick = (
    sprintId: string,
    backlogItemId: string
): SprintBacklogItemNotStartedClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export interface SprintBacklogItemReleasedClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_RELEASED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
}

export const sprintBacklogItemReleasedClick = (sprintId: string, backlogItemId: string): SprintBacklogItemReleasedClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_RELEASED_CLICK,
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

export interface SprintBacklogItemIdClickPayload {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintBacklogItemIdClickAction {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_ID_CLICK;
    payload: SprintBacklogItemIdClickPayload;
}

export const sprintBacklogItemIdClick = (sprintId: string, backlogItemId: string): SprintBacklogItemIdClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_ID_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});
