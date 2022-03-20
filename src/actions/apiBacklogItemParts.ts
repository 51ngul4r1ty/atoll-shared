// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { NoDataApiAction, ApiActionMetaDataRequestMeta, ApiActionSuccessPayloadForItem, ApiAction } from "../middleware/apiTypes";
import { ApiBacklogItemPart, ApiSprint, ItemWithId } from "../types/apiModelTypes";
import { ApiPayloadBase } from "../selectors/apiSelectors";

// utils
import { addStandardMeta, buildActionTypes } from "./utils/apiActionUtils";
import { BacklogItemPart } from "../types/backlogItemPartTypes";
import { mapBacklogItemPartToApiItem } from "../mappers/backlogItemPartMappers";
import { stripUndefinedForPatch } from "./utils/apiPayloadUtils";

// #region Item

export type ApiGetBacklogItemPartSuccessActionExtra = {
    sprint: ApiSprint;
};

export type ApiGetBacklogItemPartSuccessActionMetaPassthrough = {
    triggerAction: string | null;
    backlogItemId: string;
};

export type ApiGetBacklogItemPartActionMeta = ApiActionMetaDataRequestMeta<
    {},
    {},
    undefined,
    ApiGetBacklogItemPartSuccessActionMetaPassthrough
>;

export interface ApiGetBacklogItemPartSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_PART_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItemPart, ApiGetBacklogItemPartSuccessActionExtra>;
    meta: ApiGetBacklogItemPartActionMeta;
}

export type ApiGetBacklogItemPartOptions = {
    passthroughData?: ApiGetBacklogItemPartSuccessActionMetaPassthrough;
    payloadOverride?: ApiPayloadBase;
    endpointOverride?: string;
};

export const apiGetBacklogItemPart = (itemId: string, options: ApiGetBacklogItemPartOptions = {}): NoDataApiAction => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${itemId}`,
                method: "GET",
                headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEM_PART)
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

export interface ApiPatchBacklogItemPartMetaPassthrough {}

export type ApiPatchBacklogItemPart = Partial<ApiBacklogItemPart> & ItemWithId;

export interface ApiPatchBacklogItemPartSuccessAction {
    type: typeof ActionTypes.API_PATCH_BACKLOG_ITEM_PART_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiPatchBacklogItemPart>;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, undefined, ApiPatchBacklogItemPartMetaPassthrough>;
}

export const apiPatchBacklogItemPart = (
    backlogItemPart: Partial<BacklogItemPart>,
    payloadOverride: ApiPayloadBase = {}
): ApiAction<Partial<ApiBacklogItemPart> & ItemWithId> => {
    const data = stripUndefinedForPatch(mapBacklogItemPartToApiItem(backlogItemPart as BacklogItemPart), backlogItemPart.id);
    let result: ApiAction<ApiPatchBacklogItemPart, {}, ApiPatchBacklogItemPartMetaPassthrough> = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItemPart.id}`,
                method: "PATCH",
                data,
                headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.PATCH_BACKLOG_ITEM_PART)
            },
            ...payloadOverride
        }
    };
    return result;
};

// #endregion
