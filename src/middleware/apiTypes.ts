// externals
import type { Action } from "redux";

export interface ApiHeaders {
    [name: string]: string;
}

export type SimpleApiActionType = string;

export type ComplexApiActionType = {}; // TODO: future use

export type ApiActionType = SimpleApiActionType | ComplexApiActionType;

export type ApiActionStage = "request" | "success" | "failure";

export interface ApiActionMeta<P> {
    tryCount?: number;
    passthrough?: P;
}

export interface ApiStageActionMeta<P> extends ApiActionMeta<P> {
    apiActionStage: ApiActionStage;
}

export type ApiMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export interface ApiAction<T = {}, U = {}, P = any> extends Action {
    payload: {
        endpoint: string;
        method: ApiMethods;
        headers?: ApiHeaders;
        data?: T;
        types: ApiActionType[];
    };
    meta?: ApiActionMeta<P> & U;
}

export interface ApiStageAction<T = {}, U = {}> extends ApiAction {
    meta?: ApiStageActionMeta<any> & U;
}

export interface NoDataApiAction<U = any, P = any> extends ApiAction<undefined, U, P> {}

export interface ApiActionMetaDataRequestBody<T> {
    url: string;
    method: string;
    headers: { [header: string]: string };
    data?: T;
}

export interface ApiActionMetaDataRequestBodyWithOriginal<T> extends ApiActionMetaDataRequestBody<T> {
    original?: T;
}

/**
 * Standard API actions should have the action's parameters and any passthrough data at a bare minimum.
 */
export interface ApiActionMetaData<U = undefined, P = undefined> {
    actionParams?: U;
    passthrough?: P;
}

/**
 * "Success" and "Failure" API actions should have all of this metadata.
 */
export interface ApiActionMetaDataRequestMeta<T = any, U = undefined, OA = undefined, P = undefined> {
    // TODO: Document what originalActionArgs is used for
    originalActionArgs?: OA;
    requestBody: ApiActionMetaDataRequestBody<T>;
    actionParams?: U;
    passthrough?: P;
}

export interface ApiActionSuccessPayload<T> {
    response: T;
}

export type ApiActionSuccessPayloadForCollection<T, X = undefined> = ApiActionSuccessPayload<{ data: { items: T[]; extra: X } }>;

export type ApiActionFailurePayloadForCollection = ApiActionFailurePayload;

export type ApiActionSuccessPayloadForItem<T, X = undefined> = ApiActionSuccessPayload<{ data: { item: T; extra: X } }>;

export type ApiActionFailurePayloadForItem = ApiActionFailurePayload;

export interface ApiActionFailurePayloadConfig {
    url: string;
    method: string;
    data: string;
    headers: { [header: string]: string };
    baseURL: "";
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
}

export interface ApiActionFailurePayload {
    response: {
        message: string;
        status: number;
    };
    error: {
        message: string;
        name: string;
        stack: string;
        config: ApiActionFailurePayloadConfig;
    };
}
