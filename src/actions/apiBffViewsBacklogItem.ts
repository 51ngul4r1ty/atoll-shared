// GET_BFF_VIEWS_PLAN

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { API, NoDataApiAction, ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

// interfaces/types
import { ApiBacklogItem, ApiUserSettings } from "../apiModelTypes";

export interface ApiGetBffViewsBacklogItemResponsePayload {
    response: {
        status: number;
        data: {
            backlogItems: ApiBacklogItem[];
            userPreferences: ApiUserSettings;
        };
    };
}

export interface ApiGetBffViewsBacklogItemSuccessAction {
    type: typeof ActionTypes.API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS;
    payload: ApiGetBffViewsBacklogItemResponsePayload;
    meta?: ApiActionMetaDataRequestMeta<{}>;
}

export const apiBffViewsBacklogItem = (projectDisplayId: string, backlogItemDisplayId: string): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/bff/views/project/${projectDisplayId}/backlog-item/${backlogItemDisplayId}`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BFF_VIEWS_BACKLOG_ITEM)
    }
});
