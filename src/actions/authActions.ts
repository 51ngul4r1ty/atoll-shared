// middleware
import type { ApiAction, ApiActionMetaDataRequestBody, ApiActionSuccessPayload, ApiActionMeta } from "../middleware/apiTypes";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { API } from "../middleware/apiConsts";
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

// interfaces/types
import { SimpleFSA, FSA } from "../types/reactHelperTypes";

export type LoginUserAction = SimpleFSA<typeof ActionTypes.LOGIN_USER>;
export const loginUser = (): LoginUserAction => ({
    type: ActionTypes.LOGIN_USER
});

export interface ActionPostTokenResponseBase {
    status: number;
    data: {
        item: {
            authToken: string;
            refreshToken: string;
        };
    };
}

export interface ActionPostLoginPayloadData {
    username: string;
    password: string;
}

export type ActionPostLoginSuccessResponse = ActionPostTokenResponseBase;

export type ActionPostLoginSuccessActionPayload = ApiActionSuccessPayload<ActionPostLoginSuccessResponse>;
export interface ActionPostLoginSuccessActionMeta extends ApiActionMetaDataRequestBody<ActionPostLoginPayloadData> {
    instanceId: number;
}

export interface ActionPostLoginSuccessAction {
    type: typeof ActionTypes.API_POST_ACTION_LOGIN_SUCCESS;
    payload: ActionPostLoginSuccessActionPayload;
    meta: ActionPostLoginSuccessActionMeta;
}

export const postLogin = (username: string, password: string): ApiAction<ActionPostLoginPayloadData> => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/actions/login`,
        method: "POST",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        data: { username, password },
        types: buildActionTypes(ApiActionNames.POST_ACTION_LOGIN)
    }
});

export interface ActionPostRefreshTokenPayloadData {
    refreshToken: string;
}

export type ActionPostRefreshTokenSuccessResponse = ActionPostTokenResponseBase;

export type ActionPostRefreshTokenSuccessActionPayload = ApiActionSuccessPayload<ActionPostRefreshTokenSuccessResponse>;

export interface ActionPostRefreshTokenSuccessActionMeta extends ApiActionMetaDataRequestBody<ActionPostRefreshTokenPayloadData> {}

export interface ActionPostRefreshTokenSuccessAction {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS;
    payload: ActionPostRefreshTokenSuccessActionPayload;
    meta: ActionPostRefreshTokenSuccessActionMeta & ApiActionMeta<any>;
}

export const refreshTokenAndRetry = (refreshToken: string, actionToRetry: ApiAction<any>) => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/actions/refresh-token`,
        method: "POST",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        data: { refreshToken },
        types: buildActionTypes(ApiActionNames.POST_ACTION_REFRESH_TOKEN)
    },
    meta: {
        passthrough: {
            actionToRetry
        }
    }
});

export type SetUsernameAction = FSA<typeof ActionTypes.SET_USERNAME, string>;
export const setUsername = (username: string): SetUsernameAction => ({
    type: ActionTypes.SET_USERNAME,
    payload: username
});

export type SetPasswordAction = FSA<typeof ActionTypes.SET_PASSWORD, string>;
export const setPassword = (password: string): SetPasswordAction => ({
    type: ActionTypes.SET_PASSWORD,
    payload: password
});
