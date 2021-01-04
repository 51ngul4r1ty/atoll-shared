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
import { ApiBacklogItem, ApiSprint, ApiUserSettings } from "../apiModelTypes";

export interface ApiGetBffViewsPlanResponsePayload {
    response: {
        status: number;
        data: {
            backlogItems: ApiBacklogItem[];
            sprints: ApiSprint[];
            sprintBacklogItems: ApiBacklogItem[] | undefined;
            userPreferences: ApiUserSettings;
        };
    };
}

export interface ApiGetBffViewsPlanSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS;
    payload: ApiGetBffViewsPlanResponsePayload;
    meta?: ApiActionMetaDataRequestMeta<{}>;
}

export const apiBffViewsPlan = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/bff/views/plan`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BFF_VIEWS_PLAN)
    }
});
