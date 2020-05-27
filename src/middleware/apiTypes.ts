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
    tryCount?: number;
    passthrough?: P;
}

export type ApiMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export interface ApiAction<T, U = any> extends Action {
    payload: {
        endpoint: string;
        method: ApiMethods;
        headers?: ApiHeaders;
        data?: T;
        types: ApiActionType[];
    };
    meta?: ApiActionMeta<any> & U;
}

export interface NoDataApiAction<U = any> extends ApiAction<undefined, U> {}

export interface ApiActionMetaDataRequestBody<T> {
    url: string;
    method: string;
    headers: { [header: string]: string };
    data?: T;
}

export interface ApiActionMetaDataRequestMeta<T> {
    requestBody: ApiActionMetaDataRequestBody<T>;
}

export interface ApiActionSuccessPayload<T> {
    response: T;
}

export type ApiActionSuccessPayloadForCollection<T> = ApiActionSuccessPayload<{ data: { items: T[] } }>;

export type ApiActionSuccessPayloadForItem<T> = ApiActionSuccessPayload<{ data: { item: T } }>;
