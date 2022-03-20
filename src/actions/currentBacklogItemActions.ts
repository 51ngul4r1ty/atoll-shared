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

export type UpdateBacklogItemPartFieldAction = {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM_PART_FIELD;
    payload: {
        partId: string;
        fieldName: string;
        fieldValue: string;
    };
};
export const updateBacklogItemPartPoints = (partId: string, value: string): UpdateBacklogItemPartFieldAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM_PART_FIELD,
    payload: {
        partId,
        fieldName: "points",
        fieldValue: value
    }
});
