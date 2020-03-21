// externals
import axios, { AxiosRequestConfig } from "axios";
import { Action, Dispatch } from "redux";

// consts/enums
import { APPLICATION_JSON } from "../constants";

export interface ApiHeaders {
    [name: string]: string;
}

export type SimpleApiActionType = string;
export type ComplexApiActionType = {}; // TODO: future use

export type ApiActionType = SimpleApiActionType | ComplexApiActionType;

export interface ApiAction<T> extends Action {
    payload: {
        endpoint: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
        headers?: ApiHeaders;
        data?: T;
        types: ApiActionType[];
    };
    meta?: any;
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

const dispatchRequest = (dispatch: Dispatch<any>, requestType: ApiActionType, data: any, requestBody: any, meta: any) => {
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
    origMeta: any
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
    meta: any,
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

export interface ApiActionMetaDataRequestBody<T> extends AxiosRequestConfig {
    data?: T;
}

export interface ApiActionMetaParamsRequestBody<T> extends AxiosRequestConfig {
    params?: T;
}

export const apiMiddleware = ({ dispatch }) => (next) => (action: Action) => {
    next(action);
    if (action.type !== API) {
        return;
    }
    const apiAction = action as ApiAction<any>;
    const { endpoint, method, data, types, headers } = apiAction.payload;
    const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "";
    axios.defaults.headers.common["Content-Type"] = APPLICATION_JSON;
    //    axios.defaults.headers.common["Authorization"] = `Bearer  ${token}`;
    const requestBody: AxiosRequestConfig = {
        url: endpoint,
        method,
        headers,
        [dataOrParams]: data
    };
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
            dispatchFailure(dispatch, getFailureType(types), data, requestBody, apiAction.meta, error);

            // if (error.response && error.response.status === 403) {
            //     dispatch(accessDenied(window.location.pathname));
            // }
        });
};
