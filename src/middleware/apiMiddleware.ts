/**
 * Purpose: To make RESTful API calls.
 * Reason to change: If new features are needed for making RESTful API calls.
 */

// externals
import axios, { AxiosRequestConfig } from "axios";
import { Action, Dispatch, Store } from "redux";
import * as HttpStatus from "http-status-codes";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { StateTree } from "../reducers/rootReducer";
import { ApiActionType, ApiActionMeta, ApiActionSuccessPayload, API, ApiAction } from "./apiTypes";

// selectors
import { getAuthToken } from "../selectors/appSelectors";
import { refreshTokenAndRetry } from "../actions/authActions";

export interface ApiActionFailureError {
    message: string;
    name: string;
    stack: string;
}

export interface ApiActionFailurePayload<R> {
    response: R;
    error: ApiActionFailureError;
}

export interface ApiActionBaseMeta<T> {
    requestBody: T;
}

const getRequestType = (types: ApiActionType[]) => {
    // TODO: Add error handling
    return types[0];
};

const getSuccessType = (types: ApiActionType[]) => {
    // TODO: Add error handling
    return types[1];
};

const getFailureType = (types: ApiActionType[]) => {
    // TODO: Add error handling
    return types[2];
};

const dispatchRequest = (
    dispatch: Dispatch<any>,
    requestType: ApiActionType,
    data: any,
    requestBody: any,
    meta: ApiActionMeta<any>
) => {
    dispatch({
        type: requestType,
        payload: {
            response: data
        },
        meta: {
            ...{
                requestBody
            },
            ...meta
        }
    });
};

const dispatchSuccess = (
    dispatch: Dispatch<any>,
    type: ApiActionType,
    data: any,
    requestBody: AxiosRequestConfig,
    origMeta: ApiActionMeta<any>
) => {
    const payload: ApiActionSuccessPayload<any> = {
        response: data
    };
    const meta: ApiActionBaseMeta<any> = {
        ...{
            requestBody
        },
        ...origMeta
    };
    dispatch({
        type,
        payload,
        meta
    });
};

const dispatchFailure = (
    dispatch: Dispatch<any>,
    requestType: ApiActionType,
    data: any,
    requestBody: any,
    meta: ApiActionMeta<any>,
    error: any
) => {
    dispatch({
        type: requestType,
        payload: {
            response: data,
            error
        },
        meta: {
            ...{
                requestBody
            },
            ...meta
        }
    });
};

export interface ApiActionMetaParamsRequestBody<T> extends AxiosRequestConfig {
    params?: T;
}

export const authFailed = (errorResponseStatus: number) => {
    return errorResponseStatus === HttpStatus.UNAUTHORIZED || errorResponseStatus === HttpStatus.FORBIDDEN;
};

export const apiMiddleware = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    if (action.type !== API) {
        return;
    }
    const { dispatch, getState } = storeTyped;
    const authToken = getAuthToken(getState());
    const apiAction = action as ApiAction<any>;
    const { endpoint, method, data, types, headers } = apiAction.payload;
    const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "";
    axios.defaults.headers.common["Content-Type"] = APPLICATION_JSON;
    if (authToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer  ${authToken}`;
    }
    const requestBody: AxiosRequestConfig = {
        url: endpoint,
        method,
        headers,
        [dataOrParams]: data
    };
    const tryCount = apiAction.meta?.tryCount || 0;
    const isRetry = tryCount > 0;
    if (!isRetry) {
        dispatchRequest(dispatch, getRequestType(types), data, requestBody, apiAction.meta);
    }
    axios
        .request(requestBody)
        .then(({ data }) => {
            try {
                dispatchSuccess(dispatch, getSuccessType(types), data, requestBody, apiAction.meta);
            } catch (err) {
                console.error(`Error occurred while dispatching success: ${err}`);
            }
        })
        .catch((error) => {
            if (error.response && authFailed(error.response.status) && !isRetry) {
                if (!apiAction.meta) {
                    apiAction.meta = {
                        tryCount: 0,
                        passthrough: null
                    };
                }
                apiAction.meta.tryCount++;
                const state = getState();
                dispatch(refreshTokenAndRetry(state.app.refreshToken, apiAction));
            } else {
                dispatchFailure(dispatch, getFailureType(types), data, requestBody, apiAction.meta, error);
            }
        });
};
