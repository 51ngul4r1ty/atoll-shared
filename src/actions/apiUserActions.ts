// interfaces/types
import {
    NoDataApiAction,
    ApiActionMetaDataRequestBody,
    ApiActionSuccessPayloadForItem,
    ApiAction,
    ApiActionMetaDataRequestMeta
} from "../middleware/apiTypes";
import { ApiUserSettings, ItemWithId, UserSettings } from "../types/apiModelTypes";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";
import { stripUndefinedForPatchNoId } from "./utils/apiPayloadUtils";

export type ActionGetUserPrefsSuccessResponse = {
    appuserId: string;
    createdAt: string; // ISO Date String
    id: string;
    settings: UserSettings;
    updatedAt: string; // ISO Date String
    version: number;
};

export type ActionGetUserPrefsSuccessActionPayload = ApiActionSuccessPayloadForItem<ActionGetUserPrefsSuccessResponse>;

export type ActionGetUserPrefsPayloadData = {};

export type ActionGetUserPrefsActionMeta = {
    apiCallReason: GetUserPrefsCallReason;
};

export type ActionGetUserPrefsActionPassthroughMeta = {
    passthrough: ActionGetUserPrefsActionMeta;
};

export type ActionGetUserPrefsSuccessActionMeta = ApiActionMetaDataRequestBody<ActionGetUserPrefsPayloadData> &
    ActionGetUserPrefsActionPassthroughMeta;

export type ActionGetUserPrefsSuccessAction = {
    type: typeof ActionTypes.API_GET_USER_PREFS_SUCCESS;
    payload: ActionGetUserPrefsSuccessActionPayload;
    meta: ActionGetUserPrefsSuccessActionMeta;
};

export enum GetUserPrefsCallReason {
    InitApp,
    LoginSuccess
}

export const apiGetUserPreferences = (
    apiCallReason: GetUserPrefsCallReason
): NoDataApiAction<any, ActionGetUserPrefsActionMeta> => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/users/--self--/preferences`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_USER_PREFS)
    },
    meta: {
        passthrough: {
            apiCallReason
        }
    }
});

export type ApiPatchUserPrefsMetaPassthrough = {
    apiCallReason: PatchUserPrefsCallReason;
};

export type ApiPatchUserPrefs = Partial<ApiUserSettings> & ItemWithId;

export type ApiPatchUserPrefsSuccessAction = {
    type: typeof ActionTypes.API_PATCH_BACKLOG_ITEM_PART_SUCCESS;
    payload: ApiActionSuccessPayloadForItem<ApiPatchUserPrefs>;
    meta: ApiActionMetaDataRequestMeta<{}, undefined, undefined, ApiPatchUserPrefsMetaPassthrough>;
};

export enum PatchUserPrefsCallReason {
    SwitchProject
}

export const apiPatchUserPreferences = (
    userSettings: Partial<UserSettings>,
    apiCallReason: PatchUserPrefsCallReason
): ApiAction<Partial<ApiUserSettings>> => {
    const data = {
        settings: stripUndefinedForPatchNoId(userSettings)
    } as Partial<ApiUserSettings>;
    const result: ApiAction<Partial<ApiUserSettings>> = {
        type: API,
        payload: {
            endpoint: `${getApiBaseUrl()}api/v1/users/--self--/preferences`,
            method: "PATCH",
            data,
            headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
            types: buildActionTypes(ApiActionNames.PATCH_USER_PREFS)
        },
        meta: {
            passthrough: {
                apiCallReason
            }
        }
    };
    return result;
};
