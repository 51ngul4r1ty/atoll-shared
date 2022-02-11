// externals
import { Action } from "redux";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import {
    API,
    NoDataApiAction,
    ApiActionSuccessPayloadForCollection,
    ApiActionMetaDataRequestMeta,
    ApiAction,
    ApiActionSuccessPayload,
    ApiActionMetaDataRequestBodyWithOriginal,
    ApiActionSuccessPayloadForItem
} from "../middleware/apiTypes";
import { ApiSprint } from "../apiModelTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";
import { SprintModel } from "../types/sprintTypes";
import { Sprint } from "../reducers/sprintsReducer";

// #region Collection

export interface ApiGetSprintsSuccessAction {
    type: typeof ActionTypes.API_GET_SPRINTS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiSprint>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const buildQueryStringForGetSprints = (projectId: string, includeArchived: boolean) => {
    const baseQueryString = `?projectId=${projectId}`;
    return baseQueryString + (includeArchived ? "" : `&archived=${includeArchived}`);
};
export const apiGetSprints = (projectId: string, includeArchived: boolean): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/sprints${buildQueryStringForGetSprints(projectId, includeArchived)}`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_SPRINTS)
    }
});

// #endregion

// #region Item
export const ITEM_DETAIL_CLICK_STEP_1_NAME = "1-GetSprintDetails";
export const ITEM_DETAIL_CLICK_STEP_2_NAME = "2-GetNextSprintDetails";
export const ITEM_DETAIL_CLICK_STEP_3_NAME = "3-GetNextSprintBacklogItems";
export type ApiGetSprintSuccessActionMetaPassthrough = {
    triggerAction: string;
    stepName: string;
    sprintId: string;
    backlogItemId: string;
};
export type ApiGetSprintSuccessActionPayload = ApiActionSuccessPayloadForItem<ApiSprint>;
export type ApiGetSprintSuccessActionMeta = ApiActionMetaDataRequestMeta<
    {},
    undefined,
    undefined,
    ApiGetSprintSuccessActionMetaPassthrough
>;
export type ApiGetSprintSuccessAction = Action<typeof ActionTypes.API_GET_SPRINT_SUCCESS> & {
    payload: ApiGetSprintSuccessActionPayload;
    meta: ApiGetSprintSuccessActionMeta;
};
// TODO: Document this pattern- if the endpoint needs to be overridden it should be done through an "options.endpointOverride" arg.
export type ApiGetSprintOptions = {
    passthroughData?: ApiGetSprintSuccessActionMetaPassthrough;
    endpointOverride?: string;
};
export type ApiGetSprintResult = NoDataApiAction<any, ApiGetSprintSuccessActionMetaPassthrough>;
export const apiGetSprint = (sprintId: string | null, options: ApiGetSprintOptions): ApiGetSprintResult => {
    if (!sprintId && !options?.endpointOverride) {
        throw new Error("apiGetSprint expects either a sprintId or an endpointOverride to be provided!");
    }
    const result: ApiGetSprintResult = {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_SPRINT)
        }
    };
    // TODO: Provide a standard way to add passthrough data as an override with util functions?
    const passthrough = options?.passthroughData;
    if (passthrough) {
        result.meta = {
            ...result.meta,
            passthrough
        };
    }
    if (options?.endpointOverride) {
        result.payload.endpoint = options.endpointOverride;
    }
    return result;
};

// #endregion

export interface ApiPostSprintSuccessResponse {
    status: number;
    data: {
        item: Sprint;
    };
}

export type ApiPostSprintSuccessActionPayload = ApiActionSuccessPayload<ApiPostSprintSuccessResponse>;
export interface ApiPostSprintSuccessActionMeta {
    instanceId: number;
    requestBody: ApiActionMetaDataRequestBodyWithOriginal<ApiSprint>;
}
export interface ApiPostSprintSuccessAction {
    type: typeof ActionTypes.API_POST_SPRINT_SUCCESS;
    payload: ApiPostSprintSuccessActionPayload;
    meta: ApiPostSprintSuccessActionMeta;
}
export interface ApiPostSprintPayload {}
export const apiPostSprint = (sprint: SprintModel, meta: any): ApiAction<ApiPostSprintPayload> => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints`,
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            data: sprint,
            types: buildActionTypes(ApiActionNames.POST_SPRINT)
        },
        meta
    };
};

export interface ApiDeleteSprintSuccessResponse {
    status: number;
    data: {
        item: Sprint;
    };
}
export type ApiDeleteSprintSuccessActionPayload = ApiActionSuccessPayload<ApiDeleteSprintSuccessResponse>;
export interface ApiDeleteSprintMetaOrginalActionArgs {
    sprintId: string;
}
export interface ApiDeleteSprintMeta {
    originalActionArgs: ApiDeleteSprintMetaOrginalActionArgs;
}
export interface ApiDeleteSprintSuccessAction {
    type: typeof ActionTypes.API_DELETE_SPRINT_SUCCESS;
    payload: ApiDeleteSprintSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, ApiDeleteSprintMetaOrginalActionArgs>;
}
export type ApiDeleteSprintAction = NoDataApiAction<ApiDeleteSprintMeta>;
export const apiDeleteSprint = (sprintId: string): ApiDeleteSprintAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}`,
            method: "DELETE",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.DELETE_SPRINT)
        },
        meta: {
            originalActionArgs: {
                sprintId
            }
        }
    };
};

export interface ApiSetSprintArchiveFlagSuccessResponse {
    status: number;
    data: {
        item: Sprint;
    };
}
export type ApiSetSprintArchiveFlagSuccessActionPayload = ApiActionSuccessPayload<ApiSetSprintArchiveFlagSuccessResponse>;
export interface ApiSetSprintArchiveFlagMetaOrginalActionArgs {
    sprintId: string;
    archived: boolean;
}
export interface ApiSprintSetArchiveFlagMeta {
    originalActionArgs: ApiSetSprintArchiveFlagMetaOrginalActionArgs;
}
export interface ApiSetSprintArchiveFlagSuccessAction {
    type: typeof ActionTypes.API_SET_SPRINT_ARCHIVE_FLAG_SUCCESS;
    payload: ApiSetSprintArchiveFlagSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, ApiSetSprintArchiveFlagMetaOrginalActionArgs>;
}
export interface ApiSetSprintArchiveFlagData {
    archived: boolean;
}
export type ApiSetSprintArchiveFlagAction = ApiAction<ApiSetSprintArchiveFlagData, ApiSprintSetArchiveFlagMeta>;
export const setSprintArchiveFlag = (sprintId: string, archived: boolean): ApiSetSprintArchiveFlagAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}`,
            method: "PATCH",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.SET_SPRINT_ARCHIVE_FLAG),
            data: {
                archived
            }
        },
        meta: {
            originalActionArgs: {
                sprintId,
                archived
            }
        }
    };
};
export const apiArchiveSprint = (sprintId: string): ApiSetSprintArchiveFlagAction => {
    return setSprintArchiveFlag(sprintId, true);
};

export const apiUnarchiveSprint = (sprintId: string): ApiSetSprintArchiveFlagAction => {
    return setSprintArchiveFlag(sprintId, false);
};

export interface ApiPutSprintSuccessResponse {
    status: number;
    data: {
        item: Sprint;
    };
}

export type ApiPutSprintSuccessActionPayload = ApiActionSuccessPayload<ApiPutSprintSuccessResponse>;
export interface ApiPutSprintSuccessActionMeta {
    instanceId: number;
    requestBody: ApiActionMetaDataRequestBodyWithOriginal<ApiSprint>;
}
export interface ApiPutSprintSuccessAction {
    type: typeof ActionTypes.API_PUT_SPRINT_SUCCESS;
    payload: ApiPutSprintSuccessActionPayload;
    meta: ApiPutSprintSuccessActionMeta;
}
export interface ApiPutSprintPayload {}
export const apiPutSprint = (sprint: SprintModel, meta: any): ApiAction<ApiPutSprintPayload> => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprint.id}`,
            method: "PUT",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            data: sprint,
            types: buildActionTypes(ApiActionNames.PUT_SPRINT)
        },
        meta
    };
};
