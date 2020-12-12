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
import { ApiBacklogItem, ApiSprintBacklogItem, ApiSprintStats } from "../apiModelTypes";
import { ApiBatchAction } from "../middleware/apiBatchTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";
import { BacklogItemStatus } from "../types/backlogItemTypes";
import { mapApiStatusToBacklogItem, mapBacklogItemStatusToApi } from "../mappers/backlogItemMappers";

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

export type ApiPostSprintBacklogItemSuccessActionPayload = ApiActionSuccessPayloadForItem<ApiSprintBacklogItem, SprintStats>;
export interface ApiPostSprintBacklogItemSuccessAction {
    type: typeof ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS;
    payload: ApiPostSprintBacklogItemSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, MetaActionParams>;
}

export interface ApiPostSprintBacklogItemFailureAction {
    type: typeof ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_FAILURE;
    payload: ApiActionFailurePayload;
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

export interface ApiMoveSprintItemToProductBacklogActionParams {
    sprintId: string;
    backlogItemId: string;
}

export interface SprintStats {
    sprintStats: ApiSprintStats;
}

export type ApiMoveSprintItemToProductBacklogSuccessActionPayload = ApiActionSuccessPayloadForItem<ApiBacklogItem, SprintStats>;
export interface ApiMoveSprintItemToProductBacklogSuccessAction {
    type: typeof ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS;
    payload: ApiMoveSprintItemToProductBacklogSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, ApiMoveSprintItemToProductBacklogActionParams>;
}

export const apiMoveSprintItemToProductBacklog = (sprintId: string, backlogItemId: string) => {
    const actionParams: ApiMoveSprintItemToProductBacklogActionParams = {
        sprintId,
        backlogItemId
    };
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}/backlog-items/${backlogItemId}`,
            method: "DELETE",
            headers: { Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.DELETE_SPRINT_BACKLOG_ITEM)
        },
        meta: {
            actionParams
        }
    };
};

export interface ApiSprintBacklogItemSetStatusActionParams {
    sprintId: string;
    backlogItemId: string;
    status: BacklogItemStatus;
}

export interface ApiSprintBacklogItemSetStatusData {
    status: string;
}

export interface ApiSprintBacklogItemSetStatusSuccessAction {
    type: typeof ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItem>;
    meta: ApiActionMetaDataRequestMeta<ApiSprintBacklogItemSetStatusData, ApiSprintBacklogItemSetStatusActionParams>;
}

export const apiSprintBacklogItemSetStatus = (sprintId: string, backlogItemId: string, status: BacklogItemStatus) => {
    const actionParams: ApiSprintBacklogItemSetStatusActionParams = {
        sprintId,
        backlogItemId,
        status
    };
    return {
        type: API,
        payload: {
            // TODO: Change this to use HATEOAS (and the sprint backlog item URL)
            endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${backlogItemId}`,
            method: "PATCH",
            headers: { Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.PATCH_BACKLOG_ITEM),
            data: {
                status: mapBacklogItemStatusToApi(status)
            }
        },
        meta: {
            actionParams
        }
    };
};
