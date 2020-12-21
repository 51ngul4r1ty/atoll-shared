// actions
import { BacklogItemEditableFields } from "../components/organisms/forms/backlogItemFormTypes";
import * as ActionTypes from "./actionTypes";

export interface UpdateCurrentBacklogItemFieldsAction {
    type: typeof ActionTypes.UPDATE_CURRENT_BACKLOG_ITEM_FIELDS;
    payload: BacklogItemEditableFields;
}
export const updateCurrentBacklogItemFields = (fields: BacklogItemEditableFields): UpdateCurrentBacklogItemFieldsAction => ({
    type: ActionTypes.UPDATE_CURRENT_BACKLOG_ITEM_FIELDS,
    payload: fields
});

export interface ResetCurrentBacklogItemAction {
    type: typeof ActionTypes.RESET_CURRENT_BACKLOG_ITEM;
}
export const resetCurrentBacklogItem = (): ResetCurrentBacklogItemAction => ({
    type: ActionTypes.RESET_CURRENT_BACKLOG_ITEM
});

export interface SaveCurrentBacklogItemAction {
    type: typeof ActionTypes.SAVE_CURRENT_BACKLOG_ITEM;
}
export const saveCurrentBacklogItem = (): SaveCurrentBacklogItemAction => ({
    type: ActionTypes.SAVE_CURRENT_BACKLOG_ITEM
});
