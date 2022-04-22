// actions
import * as ActionTypes from "./actionTypes";

export interface ToggleBacklogItemPartDetailPayload {
    partId: string;
    strictMode: boolean;
}

export interface ToggleBacklogItemPartDetailAction {
    type: typeof ActionTypes.TOGGLE_BACKLOG_ITEM_PART_DETAIL;
    payload: ToggleBacklogItemPartDetailPayload;
}

export const backlogItemPartDetailClick = (partId: string, strictMode: boolean): ToggleBacklogItemPartDetailAction => ({
    type: ActionTypes.TOGGLE_BACKLOG_ITEM_PART_DETAIL,
    payload: {
        partId,
        strictMode
    }
});

export interface EditBacklogItemPartPayload {
    itemId: string;
}

export interface EditBacklogItemPartAction {
    type: typeof ActionTypes.EDIT_BACKLOG_ITEM_PART;
    payload: EditBacklogItemPartPayload;
}

export const editBacklogItemPart = (itemId: string): EditBacklogItemPartAction => ({
    type: ActionTypes.EDIT_BACKLOG_ITEM_PART,
    payload: {
        itemId
    }
});

export interface CancelEditBacklogItemPartActionPayload {
    itemId: string;
}
export interface CancelEditBacklogItemPartAction {
    type: typeof ActionTypes.CANCEL_EDIT_BACKLOG_ITEM_PART;
    payload: CancelEditBacklogItemPartActionPayload;
}
export const cancelEditBacklogItemPart = (itemId: string): CancelEditBacklogItemPartAction => ({
    type: ActionTypes.CANCEL_EDIT_BACKLOG_ITEM_PART,
    payload: {
        itemId
    }
});

export interface UpdateBacklogItemPartActionPayload {
    id: string;
}
export interface UpdateBacklogItemPartAction {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM_PART;
    payload: UpdateBacklogItemPartActionPayload;
}
export const updateBacklogItemPart = (id: string): UpdateBacklogItemPartAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM_PART,
    payload: {
        id
    }
});
