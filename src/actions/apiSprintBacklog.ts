// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { API, NoDataApiAction, ApiActionSuccessPayloadForCollection, ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";
import { ApiBacklogItem } from "../apiModelTypes";
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
