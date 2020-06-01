// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemModel, BacklogItem } from "../reducers/backlogItemsReducer";
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

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

// #region Collection

export interface ApiGetBacklogItemsSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetBacklogItems = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/backlog-items`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
    }
});

// #endregion

// #region Item

export interface ApiGetBacklogItemSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetBacklogItem = (itemId: string, payloadOverride: ApiPayloadBase = {}): NoDataApiAction => ({
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
export interface ApiPostBacklogItemPayload {}
export const apiPostBacklogItem = (
    backlogItem: BacklogItemModel,
    prevBacklogItemId: string,
    meta: any
): ApiAction<ApiPostBacklogItemPayload> => {
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

export interface ApiPutBacklogItemSuccessAction {
    type: typeof ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiPutBacklogItem = (
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

export interface ApiDeleteBacklogItemSuccessResponse {
    status: number;
    data: {
        item: BacklogItem;
    };
}
export type ApiDeleteBacklogItemSuccessActionPayload = ApiActionSuccessPayload<ApiDeleteBacklogItemSuccessResponse>;
export interface ApiDeleteBacklogItemMeta {
    originalActionArgs: {
        backlogItemId: string;
    };
}
export interface ApiDeleteBacklogItemSuccessAction {
    type: typeof ActionTypes.API_DELETE_BACKLOG_ITEM_SUCCESS;
    payload: ApiDeleteBacklogItemSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export type ApiDeleteBacklogItemAction = NoDataApiAction<ApiDeleteBacklogItemMeta>;
export const apiDeleteBacklogItem = (backlogItemId: string): ApiDeleteBacklogItemAction => {
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

// #endregion

// #region Actions

export interface ApiPostBacklogItemReorderPayloadData {
    sourceItemId: string;
    targetItemId: string;
}
export const apiPostActionBacklogItemReorder = (
    sourceItemId: string,
    targetItemId: string
): ApiAction<ApiPostBacklogItemReorderPayloadData> => {
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

// #endregion
