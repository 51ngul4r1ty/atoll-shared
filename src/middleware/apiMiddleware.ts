import axios from "axios";
import { Action, Dispatch } from "redux";

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

const dispatchRequest = (dispatch: Dispatch<any>, requestType: ApiActionType, data: any) => {
    dispatch({
        type: requestType,
        payload: {
            response: data
        }
    });
};

const dispatchSuccess = (dispatch: Dispatch<any>, requestType: ApiActionType, data: any) => {
    dispatch({
        type: requestType,
        payload: {
            response: data
        }
    });
};

const dispatchFailure = (dispatch: Dispatch<any>, requestType: ApiActionType, data: any, error: any) => {
    dispatch({
        type: requestType,
        payload: {
            response: data,
            error
        }
    });
};

export const apiMiddleware = ({ dispatch }) => (next) => (action: Action) => {
    next(action);
    if (action.type !== API) {
        return;
    }
    const apiAction = action as ApiAction<any>;
    const { endpoint, method, data, types, headers } = apiAction.payload;
    const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    //    axios.defaults.headers.common["Authorization"] = `Bearer  ${token}`;
    dispatchRequest(dispatch, getRequestType(types), data);
    axios
        .request({
            url: endpoint,
            method,
            headers,
            [dataOrParams]: data
        })
        .then(({ data }) => {
            dispatchSuccess(dispatch, getSuccessType(types), data);
        })
        .catch((error) => {
            dispatchFailure(dispatch, getFailureType(types), data, error);

            // if (error.response && error.response.status === 403) {
            //     dispatch(accessDenied(window.location.pathname));
            // }
        })
        .finally(() => {
            // if (label) {
            //     dispatch(apiEnd(label));
            // }
        });
};
