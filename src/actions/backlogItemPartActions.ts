// actions
import * as ActionTypes from "./actionTypes";

export interface ToggleBacklogItemPartDetailPayload {
    partId: string;
}

export interface ToggleBacklogItemPartDetailAction {
    type: typeof ActionTypes.TOGGLE_BACKLOG_ITEM_PART_DETAIL;
    payload: ToggleBacklogItemPartDetailPayload;
}

export const backlogItemPartDetailClick = (partId: string): ToggleBacklogItemPartDetailAction => ({
    type: ActionTypes.TOGGLE_BACKLOG_ITEM_PART_DETAIL,
    payload: {
        partId
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
