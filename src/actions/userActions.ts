// interfaces/types
import { API, NoDataApiAction, ApiActionMetaDataRequestBody, ApiActionSuccessPayload } from "../middleware/apiTypes";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

// TODO: Define this
export interface ActionGetUserPrefsSuccessResponse {}

export type ActionGetUserPrefsSuccessActionPayload = ApiActionSuccessPayload<ActionGetUserPrefsSuccessResponse>;

// TODO: Define this
export interface ActionGetUserPrefsPayloadData {}

export interface ActionGetUserPrefsSuccessActionMeta extends ApiActionMetaDataRequestBody<ActionGetUserPrefsPayloadData> {
    sourceActionType: string;
}

export interface ActionGetUserPrefsSuccessAction {
    type: typeof ActionTypes.API_GET_USER_PREFS_SUCCESS;
    payload: ActionGetUserPrefsSuccessActionPayload;
    meta: ActionGetUserPrefsSuccessActionMeta;
}

export const getUserPreferences = (sourceActionType?: string): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/users/{self}/preferences`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_USER_PREFS)
    },
    meta: {
        sourceActionType
    }
});
