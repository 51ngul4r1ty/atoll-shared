// middleware
import { API, ApiAction, ApiActionSuccessPayload, ApiActionMetaDataRequestBody } from "../middleware/apiMiddleware";

// actions
import * as ActionTypes from "./actionTypes";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemType, BacklogItemModel, BacklogItem } from "../reducers/backlogItemsReducer";
import { BacklogItemDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/BacklogItemDetailForm";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";

export const refreshBacklogItems = () => getBacklogItems();

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

export interface CancelUnsavedBacklogItemActionPayload {
    instanceId: number;
}

export interface CancelUnsavedBacklogItemAction {
    type: typeof ActionTypes.CANCEL_UNSAVED_BACKLOG_ITEM;
    payload: CancelUnsavedBacklogItemActionPayload;
}

export const cancelUnsavedBacklogItem = (instanceId: number): CancelUnsavedBacklogItemAction => ({
    type: ActionTypes.CANCEL_UNSAVED_BACKLOG_ITEM,
    payload: {
        instanceId
    }
});

export interface SaveBacklogItemActionPayload {
    instanceId: number;
}

export interface SaveBacklogItemAction {
    type: typeof ActionTypes.SAVE_BACKLOG_ITEM;
    payload: SaveBacklogItemActionPayload;
}

export const saveBacklogItem = (instanceId: number): SaveBacklogItemAction => ({
    type: ActionTypes.SAVE_BACKLOG_ITEM,
    payload: {
        instanceId
    }
});

export interface SaveBacklogItemPayload {}

export interface ApiPostBacklogItemSuccessResponse {
    status: number;
    data: {
        item: BacklogItem;
    };
}

export type ApiPostBacklogItemSuccessActionPayload = ApiActionSuccessPayload<ApiPostBacklogItemSuccessResponse>;

export interface ApiPostBacklogItemSuccessActionMeta extends ApiActionMetaDataRequestBody<BacklogItemModel> {
    instanceId: number;
}

export interface ApiPostBacklogItemSuccessAction {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS;
    payload: ApiPostBacklogItemSuccessActionPayload;
    meta: ApiPostBacklogItemSuccessActionMeta;
}

export const postBacklogItem = (
    backlogItem: BacklogItemModel,
    prevBacklogItemId: string,
    meta: any
): ApiAction<SaveBacklogItemPayload> => {
    return {
        type: API,
        payload: {
            endpoint: "http://localhost:8500/api/v1/backlog-items",
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            // TODO: Define a type for this?
            data: { ...backlogItem, prevBacklogItemId },
            types: [
                ActionTypes.API_POST_BACKLOG_ITEM_REQUEST,
                ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS,
                ActionTypes.API_POST_BACKLOG_ITEM_FAILURE
            ]
        },
        meta
    };
};

export interface ActionPostBacklogItemReorderPayloadData {
    sourceItemId: string;
    targetItemId: string;
}

export const postActionBacklogItemReorder = (
    sourceItemId: string,
    targetItemId: string
): ApiAction<ActionPostBacklogItemReorderPayloadData> => {
    return {
        type: API,
        payload: {
            endpoint: "http://localhost:8500/api/v1/actions/reorder-backlog-items",
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            data: { sourceItemId, targetItemId },
            types: [
                ActionTypes.API_POST_ACTION_REORDER_BACKLOG_ITEM_REQUEST,
                ActionTypes.API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS,
                ActionTypes.API_POST_ACTION_REORDER_BACKLOG_ITEM_FAILURE
            ]
        }
    };
};

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

export interface ReceivePushedBacklogItemAction {
    type: typeof ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM;
    payload: Partial<PushBacklogItemModel>;
}

export const receivePushedBacklogItem = (item: Partial<PushBacklogItemModel>): ReceivePushedBacklogItemAction => {
    return {
        type: ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM,
        payload: item
    };
};

export interface ReorderBacklogItemPayload {
    sourceItemId: string;
    targetItemId: string;
}

export interface ReorderBacklogItemAction {
    type: typeof ActionTypes.REORDER_BACKLOG_ITEM;
    payload: ReorderBacklogItemPayload;
}

export const reorderBacklogItems = (sourceItemId: string, targetItemId: string): ReorderBacklogItemAction => {
    return {
        type: ActionTypes.REORDER_BACKLOG_ITEM,
        payload: {
            sourceItemId,
            targetItemId
        }
    };
};
