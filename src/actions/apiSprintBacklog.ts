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
