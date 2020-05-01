// externals
import { Action } from "redux";
import { AxiosRequestConfig } from "axios";

export const API = "API";

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

export interface ApiActionMetaDataRequestBody<T> {
    data?: T;
    requestData: AxiosRequestConfig;
}

export interface ApiActionSuccessPayload<T> {
    response: T;
}
