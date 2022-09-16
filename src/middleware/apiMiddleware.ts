/**
 * Purpose: To make RESTful API calls.
 * Reason to change: If new features are needed for making RESTful API calls.
 */

// externals
import axios, { AxiosRequestConfig } from "axios";
import { Action, Dispatch, Middleware, Store } from "redux";
import { StatusCodes } from "http-status-codes";

// consts/enums
import { API } from "./apiConsts";
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { StateTree } from "../reducers/rootReducer";
import { ApiActionType, ApiActionMeta, ApiActionSuccessPayload, ApiAction } from "./apiTypes";

// selectors
import { getAuthToken } from "../selectors/appSelectors";
import { refreshTokenAndRetry } from "../actions/authActions";
import { API_ACTION_STAGE_FAILURE, API_ACTION_STAGE_REQUEST, API_ACTION_STAGE_SUCCESS } from "../actions/apiActionStages";

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

const validateTypesArray = (types: ApiActionType[]) => {
    if (types.length !== 3) {
        throw Error("API Action Types should have 3 items: request, success, and failure.");
    }
};

const getRequestType = (types: ApiActionType[]) => {
    validateTypesArray(types);
    return types[0];
};

const getSuccessType = (types: ApiActionType[]) => {
    validateTypesArray(types);
    return types[1];
};

const getFailureType = (types: ApiActionType[]) => {
    validateTypesArray(types);
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
            request: data
        },
        meta: {
            ...{
                requestBody,
                apiActionStage: API_ACTION_STAGE_REQUEST
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
            requestBody,
            apiActionStage: API_ACTION_STAGE_SUCCESS
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
    origMeta: ApiActionMeta<any>,
    error: any
) => {
    const payload = {
        response: data,
        error
    };
    const meta = {
        ...{
            requestBody,
            apiActionStage: API_ACTION_STAGE_FAILURE
        },
        ...origMeta
    };
    dispatch({
        type: requestType,
        payload,
        meta
    });
};

export interface ApiActionMetaParamsRequestBody<T> extends AxiosRequestConfig {
    params?: T;
}

export const authFailed = (errorResponseStatus: number) => {
    return errorResponseStatus === StatusCodes.UNAUTHORIZED;
};

export const apiMiddleware: Middleware<{}, StateTree> = (store) => (next) => (action: Action) => {
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
            const successType = getSuccessType(types);
            try {
                dispatchSuccess(dispatch, successType, data, requestBody, apiAction.meta);
            } catch (err) {
                console.error(`Error occurred while dispatching success for success type "${successType}": "${err}"`);
                if ((err as any)?.stack) {
                    console.log((err as any).stack);
                }
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
                dispatchFailure(dispatch, getFailureType(types), error.response?.data, requestBody, apiAction.meta, error);
            }
        });
};
