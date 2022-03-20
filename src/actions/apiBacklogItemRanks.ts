// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import type { NoDataApiAction, ApiActionSuccessPayloadForCollection, ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";
import type { ApiBacklogItemRank } from "../types/apiModelTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

// #region Collection

export interface ApiGetBacklogItemRanksSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_RANKS_SUCCESS;
    payload: ApiActionSuccessPayloadForCollection<ApiBacklogItemRank>;
    meta: ApiActionMetaDataRequestMeta<{}>;
}
export const apiGetBacklogItemRanks = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/backlog-item-ranks`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEM_RANKS)
    }
});

// #endregion
