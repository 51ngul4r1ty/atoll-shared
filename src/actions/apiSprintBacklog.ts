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
    ApiActionSuccessPayloadForItem,
    ApiActionFailurePayload
} from "../middleware/apiTypes";
import { ApiBacklogItem, ApiSprintBacklogItem } from "../apiModelTypes";
import { ApiBatchAction } from "../middleware/apiBatchTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

export interface MetaActionParams {
    sprintId: string;
}

export interface ApiGetSprintBacklogItemsSuccessAction {
    type: typeof ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}, MetaActionParams>;
}

export const apiGetSprintBacklogItems = (sprintId: string): NoDataApiAction => {
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}/backlog-items`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_SPRINT_BACKLOG_ITEMS)
        },
        // TODO: Provide a way to do this automatically with any dispatch API call
        meta: {
            actionParams: {
                sprintId
            }
        }
    };
};

export interface ApiBatchAddBacklogItemsToSprintBody {
    backlogitemId: string;
}

export interface ApiBatchAddBacklogItemsToSprintItemActionParams {
    sprintId: string;
    backlogItemId: string;
}

export interface ApiBatchAddBacklogItemsToSprintBatchActionParams {
    sprintId: string;
    backlogItemIds: string[];
}

export type ApiBatchAddBacklogItemsToSprintAction = ApiBatchAction<
    ApiBatchAddBacklogItemsToSprintBody,
    ApiBatchAddBacklogItemsToSprintItemActionParams,
    ApiBatchAddBacklogItemsToSprintBatchActionParams
>;

export interface ApiPostSprintBacklogItemSuccessAction {
    type: typeof ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiSprintBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<{}, MetaActionParams>;
}

export interface ApiPostSprintBacklogItemFailureAction {
    type: typeof ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_FAILURE;
    payload: {
        response: {
            message: string;
            status: number;
        };
        error: {
            message: string;
            name: string;
            stack: string;
            config: {
                url: string;
                method: "post";
                data: string;
                headers: { [header: string]: string };
                baseURL: "";
                transformRequest: any[];
                transformResponse: any[];
                timeout: number;
                xsrfCookieName: string;
                xsrfHeaderName: string;
                maxContentLength: number;
            };
        };
    };
    meta: {
        requestBody: {
            url: string;
            method: "POST";
            headers: { [header: string]: string };
            data: {
                backlogitemId: string;
            };
        };
        apiActionStage: "failure";
        actionParams: {
            sprintId: string;
            backlogItemId: string;
        };
        passthrough: {
            apiBatchQueueItem: true;
        };
    };
}

export const apiBatchAddBacklogItemsToSprint = (
    sprintId: string,
    backlogItemIds: string[]
): ApiBatchAddBacklogItemsToSprintAction => {
    const calls = backlogItemIds.map((backlogItemId) => ({
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}/backlog-items`,
            method: "POST",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.POST_SPRINT_BACKLOG_ITEM),
            data: {
                backlogitemId: backlogItemId
            }
        },
        meta: {
            actionParams: {
                sprintId,
                backlogItemId
            }
        }
    }));
    return {
        type: ActionTypes.API_BATCH,
        calls,
        meta: {
            actionParams: {
                sprintId,
                backlogItemIds
            }
        }
    };
};
