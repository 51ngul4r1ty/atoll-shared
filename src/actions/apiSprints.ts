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
    ApiActionMetaDataRequestBodyWithOriginal
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

export interface ApiArchiveSprintSuccessResponse {
    status: number;
    data: {
        item: Sprint;
    };
}
export type ApiArchiveSprintSuccessActionPayload = ApiActionSuccessPayload<ApiArchiveSprintSuccessResponse>;
export interface ApiArchiveSprintMetaOrginalActionArgs {
    sprintId: string;
}
export interface ApiArchiveSprintMeta {
    originalActionArgs: ApiArchiveSprintMetaOrginalActionArgs;
}
export interface ApiArchiveSprintSuccessAction {
    type: typeof ActionTypes.API_DELETE_SPRINT_SUCCESS;
    payload: ApiArchiveSprintSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, ApiArchiveSprintMetaOrginalActionArgs>;
}
export interface ApiArchiveSprintData {
    archived: boolean;
}
export type ApiArchiveSprintAction = ApiAction<ApiArchiveSprintData, ApiArchiveSprintMeta>;
export const apiArchiveSprint = (sprintId: string): ApiArchiveSprintAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}`,
            method: "PATCH",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.ARCHIVE_SPRINT),
            data: {
                archived: true
            }
        },
        meta: {
            originalActionArgs: {
                sprintId
            }
        }
    };
};
