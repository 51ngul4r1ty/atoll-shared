// actions
import * as ActionTypes from "./actionTypes";

// interfaces/types
import { BacklogItem, BacklogItemInSprint } from "../types/backlogItemTypes";

export type MoveSelectedBacklogItemsToSprintUsingApiActionPayload = {
    sprintId: string;
};

export type MoveSelectedBacklogItemsToSprintUsingApiAction = {
    type: typeof ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT;
    payload: MoveSelectedBacklogItemsToSprintUsingApiActionPayload;
};

export const moveSelectedBacklogItemsToSprintUsingApi = (sprintId: string): MoveSelectedBacklogItemsToSprintUsingApiAction => ({
    type: ActionTypes.MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT,
    payload: {
        sprintId
    }
});

export type AddBacklogItemToSprintActionPayload = {
    sprintId: string;
    backlogItem: BacklogItemInSprint;
};

export type MoveBacklogItemToSprintActionPayload = {
    sprintId: string;
    sprintBacklogItem: BacklogItemInSprint;
    productBacklogItem: BacklogItem;
};

export type MoveBacklogItemToSprintAction = {
    type: typeof ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT;
    payload: MoveBacklogItemToSprintActionPayload;
};

export const moveBacklogItemToSprint = (
    sprintId: string,
    sprintBacklogItem: BacklogItemInSprint,
    productBacklogItem: BacklogItem
): MoveBacklogItemToSprintAction => ({
    type: ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT,
    payload: {
        sprintId,
        sprintBacklogItem,
        productBacklogItem
    }
});

export type AddBacklogItemToSprintAction = {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT;
    payload: AddBacklogItemToSprintActionPayload;
};

export const addBacklogItemToSprint = (sprintId: string, backlogItem: BacklogItemInSprint): AddBacklogItemToSprintAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT,
    payload: {
        sprintId,
        backlogItem
    }
});

export type PatchBacklogItemInSprintActionPayload = {
    sprintId: string;
    backlogItemId: string;
    patchObj: Partial<BacklogItem>;
};

export type PatchBacklogItemInSprintAction = {
    type: typeof ActionTypes.PATCH_BACKLOG_ITEM_IN_SPRINT;
    payload: PatchBacklogItemInSprintActionPayload;
};

export const patchBacklogItemInSprint = (
    sprintId: string,
    backlogItemId: string,
    patchObj: Partial<BacklogItemInSprint>
): PatchBacklogItemInSprintAction => ({
    type: ActionTypes.PATCH_BACKLOG_ITEM_IN_SPRINT,
    payload: {
        sprintId,
        backlogItemId,
        patchObj
    }
});

export type SprintBacklogItemDetailClickPayload = {
    sprintId: string;
    backlogItemId: string;
    strictMode: boolean;
};

export type SprintBacklogItemDetailClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK;
    payload: SprintBacklogItemDetailClickPayload;
};

/**
 * Action that is triggered when the user clicks on the sprint backlog item's detail menu button.
 * @param sprintId
 * @param backlogItemId
 * @param strictMode instead of silently failing it will cause errors to be thrown (to catch issues during dev)
 * @returns
 */
export const sprintBacklogItemDetailClick = (
    sprintId,
    backlogItemId: string,
    strictMode: boolean
): SprintBacklogItemDetailClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
    payload: {
        sprintId,
        backlogItemId,
        strictMode
    }
});

export type ShowSprintBacklogItemDetailPayload = {
    sprintId: string;
    backlogItemId: string;
    splitToNextSprintAvailable: boolean;
    strictMode: boolean;
};

export type ShowSprintBacklogItemDetailAction = {
    type: typeof ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL;
    payload: ShowSprintBacklogItemDetailPayload;
};

export const showSprintBacklogItemDetail = (
    sprintId,
    backlogItemId: string,
    splitToNextSprintAvailable: boolean,
    strictMode: boolean
): ShowSprintBacklogItemDetailAction => ({
    type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
    payload: {
        sprintId,
        backlogItemId,
        splitToNextSprintAvailable,
        strictMode
    }
});

export type HideSprintBacklogItemDetailPayload = {
    sprintId: string;
    backlogItemId: string;
};

export type HideSprintBacklogItemDetailAction = {
    type: typeof ActionTypes.HIDE_SPRINT_BACKLOG_ITEM_DETAIL;
    payload: HideSprintBacklogItemDetailPayload;
};

export const hideSprintBacklogItemDetail = (sprintId, backlogItemId: string): HideSprintBacklogItemDetailAction => ({
    type: ActionTypes.HIDE_SPRINT_BACKLOG_ITEM_DETAIL,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type SprintMoveItemToBacklogClickPayload = {
    sprintId: string;
    backlogItemId: string;
};

export type SprintMoveItemToBacklogClickAction = {
    type: typeof ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK;
    payload: SprintMoveItemToBacklogClickPayload;
};

export const sprintMoveItemToBacklogClick = (sprintId: string, backlogItemId: string): SprintMoveItemToBacklogClickAction => ({
    type: ActionTypes.MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type SprintSplitBacklogItemClickPayload = {
    sprintId: string;
    backlogItemId: string;
};

export type SprintSplitBacklogItemClickAction = {
    type: typeof ActionTypes.SPLIT_SPRINT_BACKLOG_ITEM_CLICK;
    payload: SprintSplitBacklogItemClickPayload;
};

export const sprintSplitBacklogItemClick = (sprintId: string, backlogItemId: string): SprintSplitBacklogItemClickAction => ({
    type: ActionTypes.SPLIT_SPRINT_BACKLOG_ITEM_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type SprintBacklogItemStatusClickPayload = {
    sprintId: string;
    backlogItemId: string;
};

export type SprintBacklogItemAcceptedClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
};

export const sprintBacklogItemAcceptedClick = (sprintId: string, backlogItemId: string): SprintBacklogItemAcceptedClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type SprintBacklogItemDoneClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
};

export const sprintBacklogItemDoneClick = (sprintId: string, backlogItemId: string): SprintBacklogItemDoneClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_DONE_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type SprintBacklogItemInProgressClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
};

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

export type SprintBacklogItemNotStartedClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
};

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

export type SprintBacklogItemReleasedClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_RELEASED_CLICK;
    payload: SprintBacklogItemStatusClickPayload;
};

export const sprintBacklogItemReleasedClick = (sprintId: string, backlogItemId: string): SprintBacklogItemReleasedClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_RELEASED_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type RemoveSprintBacklogItemActionPayload = {
    sprintId: string;
    backlogItemId: string;
};
export type RemoveSprintBacklogItemAction = {
    type: typeof ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM;
    payload: RemoveSprintBacklogItemActionPayload;
};

export const removeSprintBacklogItem = (sprintId: string, backlogItemId: string): RemoveSprintBacklogItemAction => ({
    type: ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM,
    payload: {
        sprintId,
        backlogItemId
    }
});

export type ChangeSprintPlanningArchivedFilterActionPayload = {
    includeArchived: boolean;
};

export type ChangeSprintPlanningArchivedFilterAction = {
    type: typeof ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER;
    payload: ChangeSprintPlanningArchivedFilterActionPayload;
};

export const changeSprintPlanningArchivedFilter = (includeArchived: boolean): ChangeSprintPlanningArchivedFilterAction => ({
    type: ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER,
    payload: {
        includeArchived
    }
});

export type SprintBacklogItemIdClickPayload = {
    sprintId: string;
    backlogItemId: string;
};

export type SprintBacklogItemIdClickAction = {
    type: typeof ActionTypes.SPRINT_BACKLOG_ITEM_ID_CLICK;
    payload: SprintBacklogItemIdClickPayload;
};

export const sprintBacklogItemIdClick = (sprintId: string, backlogItemId: string): SprintBacklogItemIdClickAction => ({
    type: ActionTypes.SPRINT_BACKLOG_ITEM_ID_CLICK,
    payload: {
        sprintId,
        backlogItemId
    }
});
