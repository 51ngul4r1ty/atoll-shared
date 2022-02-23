// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemModel } from "../types/backlogItemTypes";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import {
    ApiAction,
    ApiActionSuccessPayload,
    NoDataApiAction,
    ApiActionSuccessPayloadForCollection,
    ApiActionMetaDataRequestMeta,
    ApiActionSuccessPayloadForItem,
    ApiActionMetaDataRequestBodyWithOriginal
} from "../middleware/apiTypes";
import { ApiBacklogItem } from "../types/apiModelTypes";
import { ApiPayloadBase } from "../selectors/apiSelectors";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";
import { mapBacklogItemToApiItem } from "../mappers/backlogItemMappers";

// #region Collection

export interface ApiGetBacklogItemsSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetBacklogItems = (): NoDataApiAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
        }
    };
};

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
        item: ApiBacklogItem;
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
export interface ApiPostBacklogItemPayload extends ApiBacklogItem {
    prevBacklogItemId: string;
}
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
            data: { ...mapBacklogItemToApiItem(backlogItem), prevBacklogItemId },
            types: buildActionTypes(ApiActionNames.POST_BACKLOG_ITEM)
        },
        meta
    };
};

export enum PutBacklogItemCallReason {
    None = 0,
    SaveCurrentBacklogItem = 1
}

export interface ApiPutBacklogItemMetaPassthrough {
    apiCallReason: PutBacklogItemCallReason;
}

export interface ApiPutBacklogItemSuccessAction {
    type: typeof ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, undefined, ApiPutBacklogItemMetaPassthrough>;
}

export const apiPutBacklogItem = (
    backlogItem: BacklogItemModel,
    payloadOverride: ApiPayloadBase = {},
    apiCallReason: PutBacklogItemCallReason = PutBacklogItemCallReason.None
): ApiAction<ApiBacklogItem> => {
    let result: ApiAction<ApiBacklogItem, {}, ApiPutBacklogItemMetaPassthrough> = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItem.id}`,
                method: "PUT",
                data: mapBacklogItemToApiItem(backlogItem),
                headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.PUT_BACKLOG_ITEM)
            },
            ...payloadOverride
        }
    };
    if (apiCallReason !== PutBacklogItemCallReason.None) {
        result = {
            ...result,
            meta: {
                passthrough: {
                    apiCallReason
                }
            }
        };
    }
    return result;
};

export interface ApiDeleteBacklogItemSuccessResponse {
    status: number;
    data: {
        item: ApiBacklogItem;
    };
}
export type ApiDeleteBacklogItemSuccessActionPayload = ApiActionSuccessPayload<ApiDeleteBacklogItemSuccessResponse>;

export interface ApiDeleteBacklogItemMetaOriginalActionArgs {
    backlogItemId: string;
}
export interface ApiDeleteBacklogItemMeta {
    originalActionArgs: ApiDeleteBacklogItemMetaOriginalActionArgs;
}
export interface ApiDeleteBacklogItemSuccessAction {
    type: typeof ActionTypes.API_DELETE_BACKLOG_ITEM_SUCCESS;
    payload: ApiDeleteBacklogItemSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, ApiDeleteBacklogItemMetaOriginalActionArgs>;
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
