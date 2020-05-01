// externals
import axios, { AxiosRequestConfig } from "axios";
import { Action, Dispatch, Store } from "redux";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { StateTree } from "../types";

// selectors
import { getAuthToken } from "../selectors/appSelectors";
import { refreshTokenAndRetry } from "../actions/authActions";

export interface ApiHeaders {
    [name: string]: string;
}

export type SimpleApiActionType = string;
export type ComplexApiActionType = {}; // TODO: future use

export type ApiActionType = SimpleApiActionType | ComplexApiActionType;

export interface ApiActionMeta<P> {
    tryCount: number;
    passthrough: P;
}

export interface ApiAction<T> extends Action {
    payload: {
        endpoint: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
        headers?: ApiHeaders;
        data?: T;
        types: ApiActionType[];
    };
    meta?: ApiActionMeta<any>;
}

export interface ApiActionFailureError {
    message: string;
    name: string;
    stack: string;
}

export interface ApiActionFailurePayload<R> {
    response: R;
    error: ApiActionFailureError;
}

export interface ApiActionSuccessPayload<T> {
    response: T;
}

export interface ApiActionBaseMeta<T> {
    requestBody: T;
}

export const API = "API";

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

export interface ApiActionMetaDataRequestBody<T> {
    data?: T;
    requestData: AxiosRequestConfig;
}

export interface ApiActionMetaParamsRequestBody<T> extends AxiosRequestConfig {
    params?: T;
}

export const apiMiddleware = (store: Store<StateTree>) => (next) => (action: Action) => {
    next(action);
    if (action.type !== API) {
        return;
    }
    const { dispatch, getState } = store;
    const state = getState();
    const authToken = getAuthToken(state);
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
    // TODO: Add check here to see if retrying (and don't re-dispatch)
    dispatchRequest(dispatch, getRequestType(types), data, requestBody, apiAction.meta);
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
            const tryCount = apiAction.meta?.tryCount || 0;
            if (error.response && error.response.status === 403 && tryCount === 0) {
                if (!apiAction.meta) {
                    apiAction.meta = {
                        tryCount: 0,
                        passthrough: null
                    };
                }
                apiAction.meta.tryCount++;
                dispatch(refreshTokenAndRetry(state.app.refreshToken, apiAction));
            } else {
                dispatchFailure(dispatch, getFailureType(types), data, requestBody, apiAction.meta, error);
            }
        });
};
