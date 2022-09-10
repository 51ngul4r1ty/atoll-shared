// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import type { ApiAction, ApiActionMetaDataRequestMeta, NoDataApiAction } from "../middleware/apiTypes";
import type { ApiProject } from "../types/apiModelTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

export interface ApiGetProjectRouteToBacklogItemViewMeta {
    backlogItemDisplayId: string;
    routeToBacklogItemView: boolean;
}

export type ApiGetProjectResponsePayload = {
    response: {
        status: number;
        data: {
            item: ApiProject;
        };
    };
};

export type ApiGetProjectSuccessAction<P> = {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiGetProjectResponsePayload;
    meta?: ApiActionMetaDataRequestMeta<any, undefined, undefined, P>;
};

export type ApiGetProjectSuccessRouteToBacklogItemViewAction = ApiGetProjectSuccessAction<ApiGetProjectRouteToBacklogItemViewMeta>;

/**
 * Make an API call to retrieve the project data.
 * @param projectId ID to find specific project.
 * @param metaPassthrough If provided, the downstream code can use this information however it needs to.
 */
export const apiGetProject = <P>(projectId: string, metaPassthrough?: P): ApiAction<undefined, any, P> => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/projects/${projectId}`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_PROJECT)
        }
    };
    if (metaPassthrough) {
        return {
            ...result,
            meta: {
                passthrough: metaPassthrough
            }
        };
    } else {
        return result;
    }
};

export type ApiGetProjectsResponsePayload = {
    response: {
        status: number;
        data: {
            items: ApiProject[];
        };
    };
};

export interface ApiGetProjectsSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiGetProjectsResponsePayload;
}

/**
 * Make an API call to retrieve the project collection data.
 */
export const apiGetProjects = (): ApiAction<undefined, any> => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/projects`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_PROJECTS)
        }
    };
    return result;
};
