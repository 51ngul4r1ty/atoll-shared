// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { NoDataApiAction, ApiActionMetaDataRequestMeta, ApiActionSuccessPayloadForItem } from "../middleware/apiTypes";
import { ApiBacklogItemPart, ApiSprint } from "../types/apiModelTypes";
import { ApiPayloadBase } from "../selectors/apiSelectors";

// utils
import { addStandardMeta, buildActionTypes } from "./utils/apiActionUtils";

// #region Item

export type ApiGetBacklogItemPartSuccessActionExtra = {
    sprint: ApiSprint;
};

export type ApiGetBacklogItemPartSuccessActionMetaPassthrough = {
    triggerAction: string | null;
    backlogItemId: string;
};

export type ApiGetBacklogItemPartActionMeta = ApiActionMetaDataRequestMeta<
    {},
    {},
    undefined,
    ApiGetBacklogItemPartSuccessActionMetaPassthrough
>;

export interface ApiGetBacklogItemPartSuccessAction {
    type: typeof ActionTypes.API_GET_BACKLOG_ITEM_PART_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiBacklogItemPart, ApiGetBacklogItemPartSuccessActionExtra>;
    meta: ApiGetBacklogItemPartActionMeta;
}

export type ApiGetBacklogItemPartOptions = {
    passthroughData?: ApiGetBacklogItemPartSuccessActionMetaPassthrough;
    payloadOverride?: ApiPayloadBase;
    endpointOverride?: string;
};

export const apiGetBacklogItemPart = (itemId: string, options: ApiGetBacklogItemPartOptions = {}): NoDataApiAction => {
    const result: NoDataApiAction = {
        type: API,
        payload: {
            ...{
                endpoint: `${getApiBaseUrl()}api/v1/backlog-items/${itemId}`,
                method: "GET",
                headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.GET_BACKLOG_ITEM_PART)
            },
            ...options.payloadOverride
        }
    };
    addStandardMeta(result, {}, options?.passthroughData);
    if (options?.endpointOverride) {
        result.payload.endpoint = options.endpointOverride;
    }
    return result;
};

// #endregion
