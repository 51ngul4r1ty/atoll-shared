// interfaces/types
import { API, NoDataApiAction, ApiActionMetaDataRequestBody, ApiActionSuccessPayloadForItem } from "../middleware/apiTypes";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

export interface ActionGetUserPrefsSuccessResponse {
    appuserId: string;
    createdAt: string; // ISO Date String
    id: string;
    settings: {
        selectedProject: string;
        selectedSprint: string;
        detectBrowserDarkMode: boolean;
    };
    updatedAt: string; // ISO Date String
    version: number;
}

export type ActionGetUserPrefsSuccessActionPayload = ApiActionSuccessPayloadForItem<ActionGetUserPrefsSuccessResponse>;

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
