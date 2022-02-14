// externals
import type { Action } from "redux";

export interface BatchApiCall<T, AP> {
    payload: {
        endpoint: string;
        method: string;
        headers: { [header: string]: string };
        types: string[];
        body?: T;
    };
    meta: {
        actionParams: AP;
    };
}

export interface ApiBatchAction<T, AP, BAP> extends Action {
    calls: BatchApiCall<T, AP>[];
    meta: {
        actionParams: BAP;
    };
}
