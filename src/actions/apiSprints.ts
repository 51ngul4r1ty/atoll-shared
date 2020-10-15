// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { API, NoDataApiAction, ApiActionSuccessPayloadForCollection, ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";
import { ApiSprint } from "../apiModelTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

// #region Collection

export interface ApiGetSprintsSuccessAction {
    type: typeof ActionTypes.API_GET_SPRINTS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiSprint>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetSprints = (projectId: string): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/sprints?projectId=${projectId}`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEMS)
    }
});

// #endregion
