// middleware
import { API, ApiAction, ApiActionMetaDataRequestBody, ApiActionSuccessPayload } from "../middleware/apiMiddleware";

// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

// interfaces/types
import { SimpleFSA, FSA } from "../types";

export type LoginUserAction = SimpleFSA<typeof ActionTypes.LOGIN_USER>;
export const loginUser = (): LoginUserAction => ({
    type: ActionTypes.LOGIN_USER
});

export interface ActionPostLoginPayloadData {
    username: string;
    password: string;
}

export interface ActionPostLoginSuccessResponse {
    status: number;
    data: {
        item: {
            authToken: string;
            refreshToken: string;
        };
    };
}

export type ActionPostLoginSuccessActionPayload = ApiActionSuccessPayload<ActionPostLoginSuccessResponse>;
export interface ActionPostLoginSuccessActionMeta extends ApiActionMetaDataRequestBody<ActionPostLoginPayloadData> {
    instanceId: number;
}

export interface ActionPostLoginSuccessAction {
    type: typeof ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS;
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
