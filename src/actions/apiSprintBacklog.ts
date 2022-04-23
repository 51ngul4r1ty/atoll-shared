// externals
import type { Action } from "redux";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";
import { BacklogItemStatus } from "../types/backlogItemEnums";

// interfaces/types
import type {
    NoDataApiAction,
    ApiActionSuccessPayloadForCollection,
    ApiActionMetaDataRequestMeta,
    ApiActionSuccessPayloadForItem,
    ApiActionFailurePayload,
    ApiActionFailurePayloadForCollection
} from "../middleware/apiTypes";
import type {
    ApiBacklogItem,
    ApiBacklogItemInSprint,
    ApiBacklogItemPart,
    ApiBacklogItemWithParts,
    ApiSprintBacklogItem,
    ApiSprintStats
} from "../types/apiModelTypes";
import type { ApiBatchAction } from "../middleware/apiBatchTypes";
import type { ApiItemDetailMenuActionFlowSuccessMeta } from "../actionFlows/itemDetailMenuActionFlow";

// utils
import { addStandardMeta, buildActionTypes } from "./utils/apiActionUtils";
import { mapBacklogItemStatusToApi } from "../mappers/statusMappers";

export type ApiGetSprintBacklogItemsSuccessActionParams = {
    sprintId: string;
    backlogItemId: string;
};
export type ApiGetSprintBacklogItemsSuccessActionMetaPassthrough = ApiItemDetailMenuActionFlowSuccessMeta;
export type ApiGetSprintBacklogItemsSuccessOrFailureActionMeta = ApiActionMetaDataRequestMeta<
    {},
    ApiGetSprintBacklogItemsSuccessActionParams,
    undefined,
    ApiGetSprintBacklogItemsSuccessActionMetaPassthrough
>;
export type ApiGetSprintBacklogItemsSuccessActionMeta = ApiGetSprintBacklogItemsSuccessOrFailureActionMeta;
export type ApiGetSprintBacklogItemsFailureActionMeta = ApiGetSprintBacklogItemsSuccessOrFailureActionMeta;

export type ApiGetSprintBacklogItemsSuccessActionPayload = ApiActionSuccessPayloadForCollection<ApiBacklogItemInSprint>;
export type ApiGetSprintBacklogItemsFailureActionPayload = ApiActionFailurePayloadForCollection;
export type ApiGetSprintBacklogItemsSuccessAction = Action<typeof ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS> & {
    payload: ApiGetSprintBacklogItemsSuccessActionPayload;
    meta: ApiGetSprintBacklogItemsSuccessActionMeta;
};
export type ApiGetSprintBacklogItemsFailureAction = Action<typeof ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE> & {
    payload: ApiGetSprintBacklogItemsFailureActionPayload;
    meta: ApiGetSprintBacklogItemsFailureActionMeta;
};
export type ApiGetSprintBacklogItemsOptions = {
    passthroughData?: ApiGetSprintBacklogItemsSuccessActionMetaPassthrough;
};

export const apiGetSprintBacklogItems = (sprintId: string, options?: ApiGetSprintBacklogItemsOptions): NoDataApiAction => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}/backlog-items`,
            method: "GET",
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.GET_SPRINT_BACKLOG_ITEMS)
        }
    };
    addStandardMeta(result, { sprintId }, options?.passthroughData);
    return result;
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

export type ApiPostSprintBacklogItemSuccessActionMeta = {
    sprintId: string;
    backlogItemId: string;
};
export type ApiPostSprintBacklogItemSuccessActionPayload = ApiActionSuccessPayloadForItem<
    ApiSprintBacklogItem,
    SprintBacklogItemSuccessPayloadExtra
>;
export type ApiPostSprintBacklogItemSuccessAction = Action<typeof ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS> & {
    payload: ApiPostSprintBacklogItemSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, ApiPostSprintBacklogItemSuccessActionMeta>;
};

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

export interface SprintBacklogItemSuccessPayloadExtra extends SprintStats {
    sprintStats: ApiSprintStats;
    backlogItem: ApiBacklogItemWithParts;
    backlogItemPart: ApiBacklogItemPart;
}

export interface MoveBacklogItemToBacklogSuccessPayloadExtra extends SprintStats {
    sprintStats: ApiSprintStats;
    backlogItem: ApiBacklogItem;
}

export type ApiMoveSprintItemToProductBacklogSuccessActionPayload = ApiActionSuccessPayloadForItem<
    ApiBacklogItem,
    MoveBacklogItemToBacklogSuccessPayloadExtra
>;
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

export interface ApiSplitSprintItemSuccessActionPayloadExtra {
    backlogItem: ApiBacklogItem;
    sprintBacklogItem: ApiSprintBacklogItem;
    sprintStats: ApiSprintStats;
}

export interface ApiSplitSprintItemActionParams {
    sprintId: string;
    backlogItemId: string;
}

export type ApiSplitSprintItemSuccessActionPayload = ApiActionSuccessPayloadForItem<
    ApiBacklogItemPart,
    ApiSplitSprintItemSuccessActionPayloadExtra
>;
export type ApiSplitSprintItemSuccessAction = Action<typeof ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS> & {
    payload: ApiSplitSprintItemSuccessActionPayload;
    meta: ApiActionMetaDataRequestMeta<{}, ApiSplitSprintItemActionParams>;
};

export const apiSplitSprintBacklogItem = (sprintId: string, backlogItemId: string) => {
    const actionParams: ApiMoveSprintItemToProductBacklogActionParams = {
        sprintId,
        backlogItemId
    };
    return {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/sprints/${sprintId}/backlog-items/${backlogItemId}/parts`,
            method: "POST",
            headers: { Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.POST_SPRINT_BACKLOG_ITEM_PART)
        },
        meta: {
            actionParams
        }
    };
};

export interface ApiSprintBacklogItemSetStatusActionParams {
    sprintId: string;
    backlogItemPartId: string;
    status: BacklogItemStatus;
}

export interface ApiSprintBacklogItemSetStatusData {
    status: string;
}

export type ApiSprintBacklogItemSetStatusActionPayload = ApiActionSuccessPayloadForItem<ApiBacklogItem, SprintStats>;

export type ApiSprintBacklogItemSetStatusSuccessAction = Action<typeof ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS> & {
    payload: ApiSprintBacklogItemSetStatusActionPayload;
    meta: ApiActionMetaDataRequestMeta<ApiSprintBacklogItemSetStatusData, ApiSprintBacklogItemSetStatusActionParams>;
};

export const apiSprintBacklogItemSetStatus = (sprintId: string, backlogItemPartId: string, status: BacklogItemStatus) => {
    const actionParams: ApiSprintBacklogItemSetStatusActionParams = {
        sprintId,
        backlogItemPartId,
        status
    };
    return {
        type: API,
        payload: {
            // TODO: Change this to use HATEOAS (and the sprint backlog item URL)
            endpoint: `${getApiBaseUrl()}api/v1/backlog-item-parts/${backlogItemPartId}`,
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
