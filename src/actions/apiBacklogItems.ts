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
import { ApiBacklogItem, ApiBacklogItemPart } from "../types/apiModelTypes";
import { ApiPayloadBase } from "../selectors/apiSelectors";

// utils
import { addStandardMeta, buildActionTypes } from "./utils/apiActionUtils";
import { mapBacklogItemToApiItem } from "../mappers/backlogItemMappers";

// #region Collection

export interface ApiGetBacklogItemsSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetBacklogItems = (projectId: string): NoDataApiAction => {
    if (!projectId) {
        throw new Error("Project ID must be provided when retrieving backlog items!");
    }
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items?projectId=${projectId}`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
        }
    };
};

// #endregion

// #region Item

export type ApiGetBacklogItemSuccessActionExtra = {
    inProductBacklog: boolean;
    sprintIds: string[];
};

export type ApiGetBacklogItemSuccessActionMetaPassthrough = {
    triggerAction: string | null;
    backlogItemId: string;
};

export type ApiGetBacklogItemActionMeta = ApiActionMetaDataRequestMeta<
    {},
    {},
    undefined,
    ApiGetBacklogItemSuccessActionMetaPassthrough
>;

export interface ApiGetBacklogItemSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem, ApiGetBacklogItemSuccessActionExtra>;
    meta: ApiGetBacklogItemActionMeta;
}

export type ApiGetBacklogItemOptions = {
    passthroughData?: ApiGetBacklogItemSuccessActionMetaPassthrough;
    payloadOverride?: ApiPayloadBase;
    endpointOverride?: string;
};

export const apiGetBacklogItem = (itemId: string, options: ApiGetBacklogItemOptions = {}): NoDataApiAction => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${itemId}`,
                method: "GET",
                headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEM)
            },
            ...options.payloadOverride
        }
    };
    addStandardMeta(result, {}, options?.passthroughData);
    if (options?.endpointOverride) {
        result.payload.endpoint = options.endpointOverride;
    }
    return result;
};

export type ApiPostBacklogItemRequestActionPayload = {
    request: ApiPostBacklogItemPayload;
};
export interface ApiPostBacklogItemRequestActionMeta {
    instanceId: number;
    requestBody: ApiActionMetaDataRequestBodyWithOriginal<ApiPostBacklogItemPayload>;
}
export type ApiPostBacklogItemRequestAction = {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_REQUEST;
    payload: ApiPostBacklogItemRequestActionPayload;
    meta: ApiPostBacklogItemRequestActionMeta;
};

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
export type ApiPostBacklogItemSuccessAction = {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS;
    payload: ApiPostBacklogItemSuccessActionPayload;
    meta: ApiPostBacklogItemSuccessActionMeta;
};
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

export type ApiPutBacklogItemPayload = ApiBacklogItem;
export type ApiPutBacklogItemRequestActionPayload = {
    request: ApiPutBacklogItemPayload;
};
export interface ApiPutBacklogItemRequestActionMeta {
    apiActionStage: number;
    requestBody: ApiActionMetaDataRequestBodyWithOriginal<ApiPutBacklogItemPayload>;
}
export type ApiPutBacklogItemRequestAction = {
    type: typeof ActionTypes.API_PUT_BACKLOG_ITEM_REQUEST;
    payload: ApiPutBacklogItemRequestActionPayload;
};

export enum PutBacklogItemCallReason {
    None = 0,
    SaveCurrentBacklogItem = 1
}

export type ApiPutBacklogItemMetaPassthrough = {
    apiCallReason: PutBacklogItemCallReason;
};

export type ApiPutBacklogItemSuccessAction = {
    type: typeof ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, undefined, ApiPutBacklogItemMetaPassthrough>;
};

export const apiPutBacklogItem = (
    backlogItem: BacklogItemModel,
    payloadOverride: ApiPayloadBase = {},
    apiCallReason: PutBacklogItemCallReason = PutBacklogItemCallReason.None
): ApiAction<ApiPutBacklogItemPayload> => {
    let result: ApiAction<ApiPutBacklogItemPayload, {}, ApiPutBacklogItemMetaPassthrough> = {
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

export type ApiBacklogItemPartWithSprintId = ApiBacklogItemPart & {
    sprintId: string | null;
};
export type ApiJoinUnallocatedBacklogItemPartsSuccessExtra = {
    backlogItemPartsWithSprintId: ApiBacklogItemPartWithSprintId[];
};
export type ApiJoinUnallocatedBacklogItemPartsSuccessAction = {
    type: typeof ActionTypes.API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem, ApiJoinUnallocatedBacklogItemPartsSuccessExtra>;
};
export type ApiJoinUnallocatedBacklogItemPartsAction = ApiAction<ApiBacklogItem>;
export const apiJoinUnallocatedBacklogItemParts = (
    backlogItemId: string,
    payloadOverride: ApiPayloadBase = {}
): ApiJoinUnallocatedBacklogItemPartsAction => {
    let result: ApiAction<ApiBacklogItem, {}, ApiPutBacklogItemMetaPassthrough> = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItemId}/join-unallocated-parts`,
                method: "POST",
                data: undefined,
                headers: { Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS)
            },
            ...payloadOverride
        }
    };
    return result;
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
