// middleware
import { API, ApiAction } from "../middleware/apiMiddleware";

// actions
import * as ActionTypes from "./actionTypes";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemType } from "../reducers/backlogItemsReducer";
import { BacklogItemDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/BacklogItemDetailForm";

export const getBacklogItems = (): ApiAction<undefined> => ({
    type: API,
    payload: {
        endpoint: "http://localhost:8500/api/v1/backlog-items",
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: [
            ActionTypes.API_GET_BACKLOG_ITEMS_REQUEST,
            ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS,
            ActionTypes.API_GET_BACKLOG_ITEMS_FAILURE
        ]
    }
});

let lastInstanceId = 0;

export interface AddNewBacklogItemActionPayload {
    type: BacklogItemType;
    instanceId: number;
}
export interface AddNewBacklogItemAction {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM;
    payload: AddNewBacklogItemActionPayload;
}

export const addNewBacklogItem = (type: BacklogItemType): AddNewBacklogItemAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEM,
    payload: {
        type,
        instanceId: ++lastInstanceId
    }
});

export interface UpdateBacklogItemFieldsAction {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS;
    payload: BacklogItemDetailFormEditableFieldsWithInstanceId;
}

export const updateBacklogItemFields = (
    fields: BacklogItemDetailFormEditableFieldsWithInstanceId
): UpdateBacklogItemFieldsAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS,
    payload: fields
});
