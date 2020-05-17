// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemType, BacklogItemModel, BacklogItem } from "../reducers/backlogItemsReducer";
import { BacklogItemDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/BacklogItemDetailForm";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import { API, ApiAction, ApiActionSuccessPayload, ApiActionMetaDataRequestBody, NoDataApiAction } from "../middleware/apiTypes";

// config
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

export const refreshBacklogItems = () => getBacklogItems();

export const getBacklogItems = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/backlog-items`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
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
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items`,
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            data: { ...backlogItem, prevBacklogItemId },
            types: buildActionTypes(ApiActionNames.POST_BACKLOG_ITEM)
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
            endpoint: `${getApiBaseUrl()}api/v1/actions/reorder-backlog-items`,
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            data: { sourceItemId, targetItemId },
            types: buildActionTypes(ApiActionNames.POST_ACTION_REORDER_BACKLOG_ITEM)
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

export const reorderBacklogItems = (sourceItemId: string, targetItemId: string): ReorderBacklogItemAction => ({
    type: ActionTypes.REORDER_BACKLOG_ITEM,
    payload: {
        sourceItemId,
        targetItemId
    }
});

export interface ToggleBacklogItemDetailPayload {
    itemId: string;
}

export interface ToggleBacklogItemDetailAction {
    type: typeof ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL;
    payload: ToggleBacklogItemDetailPayload;
}

export const backlogItemDetailClicked = (itemId: string): ToggleBacklogItemDetailAction => ({
    type: ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL,
    payload: {
        itemId
    }
});

export interface RemoveBacklogItemMeta {
    originalActionArgs: {
        backlogItemId: string;
    };
}

export type RemoveBacklogItemAction = NoDataApiAction<RemoveBacklogItemMeta>;

export const removeBacklogItem = (backlogItemId: string): RemoveBacklogItemAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItemId}`,
            method: "DELETE",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.DELETE_BACKLOG_ITEM)
        },
        meta: {
            originalActionArgs: {
                backlogItemId
            }
        }
    };
};
