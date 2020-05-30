// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemType, BacklogItemModel, BacklogItem } from "../reducers/backlogItemsReducer";
import { BacklogItemDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/BacklogItemDetailForm";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import {
    API,
    ApiAction,
    ApiActionSuccessPayload,
    NoDataApiAction,
    ApiActionSuccessPayloadForCollection,
    ApiActionMetaDataRequestMeta,
    ApiActionSuccessPayloadForItem,
    ApiActionMetaDataRequestBodyWithOriginal
} from "../middleware/apiTypes";
import { ApiBacklogItem } from "../apiModelTypes";
import { ApiPayloadBase } from "../selectors/apiSelectors";

// config
import { getApiBaseUrl } from "../config";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

export const refreshBacklogItems = () => getBacklogItems();

export interface GetBacklogItemsSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}

export const getBacklogItems = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/backlog-items`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
    }
});

export interface GetBacklogItemSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}

export const getBacklogItem = (itemId: string, payloadOverride: ApiPayloadBase = {}): NoDataApiAction => ({
    type: API,
    payload: {
        ...{
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${itemId}`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEM)
        },
        ...payloadOverride
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

export interface CancelEditBacklogItemActionPayload {
    itemId: string;
}

export interface CancelEditBacklogItemAction {
    type: typeof ActionTypes.CANCEL_EDIT_BACKLOG_ITEM;
    payload: CancelEditBacklogItemActionPayload;
}

export const cancelEditBacklogItem = (itemId: string): CancelEditBacklogItemAction => ({
    type: ActionTypes.CANCEL_EDIT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});

export interface SaveNewBacklogItemActionPayload {
    instanceId: number;
}

export interface SaveNewBacklogItemAction {
    type: typeof ActionTypes.SAVE_NEW_BACKLOG_ITEM;
    payload: SaveNewBacklogItemActionPayload;
}

export const saveNewBacklogItem = (instanceId: number): SaveNewBacklogItemAction => ({
    type: ActionTypes.SAVE_NEW_BACKLOG_ITEM,
    payload: {
        instanceId
    }
});

export interface UpdateBacklogItemActionPayload {
    id: string;
}

export interface UpdateBacklogItemAction {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM;
    payload: UpdateBacklogItemActionPayload;
}

export const updateBacklogItem = (id: string): UpdateBacklogItemAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM,
    payload: {
        id
    }
});

export interface ApiPostBacklogItemSuccessResponse {
    status: number;
    data: {
        item: BacklogItem;
    };
}

export type ApiPostBacklogItemSuccessActionPayload = ApiActionSuccessPayload<ApiPostBacklogItemSuccessResponse>;

export interface ApiPostBacklogItemSuccessActionMeta {
    instanceId: number;
    requestBody: ApiActionMetaDataRequestBodyWithOriginal<PushBacklogItemModel>;
}

export interface ApiPostBacklogItemSuccessAction {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS;
    payload: ApiPostBacklogItemSuccessActionPayload;
    meta: ApiPostBacklogItemSuccessActionMeta;
}

export interface AddBacklogItemPayload {}

export const postBacklogItem = (
    backlogItem: BacklogItemModel,
    prevBacklogItemId: string,
    meta: any
): ApiAction<AddBacklogItemPayload> => {
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

export interface PutBacklogItemSuccessAction {
    type: typeof ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}

export const putBacklogItem = (
    backlogItem: BacklogItemModel,
    payloadOverride: ApiPayloadBase = {}
): ApiAction<BacklogItemModel> => ({
    type: API,
    payload: {
        ...{
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItem.id}`,
            method: "PUT",
            data: backlogItem,
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.PUT_BACKLOG_ITEM)
        },
        ...payloadOverride
    }
});

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

export interface EditBacklogItemPayload {
    itemId: string;
}

export interface EditBacklogItemAction {
    type: typeof ActionTypes.EDIT_BACKLOG_ITEM;
    payload: EditBacklogItemPayload;
}

export const editBacklogItem = (itemId: string): EditBacklogItemAction => ({
    type: ActionTypes.EDIT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});
