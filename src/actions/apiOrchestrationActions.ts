// actions
import { API } from "../middleware/apiTypes";
import * as ActionTypes from "./actionTypes";

export interface ApiBatchProcessQueueAction {
    type: typeof ActionTypes.API_BATCH_PROCESS_QUEUE;
}

export const apiBatchProcessQueue = () => ({
    type: ActionTypes.API_BATCH_PROCESS_QUEUE
});

export interface ApiBatchQueueItemActionMeta {
    passthrough: {
        apiBatchQueueItem: boolean;
    };
}

export interface ApiBatchQueueItemAction<T, M> {
    type: typeof API;
    payload: T;
    meta: M & ApiBatchQueueItemActionMeta;
}

export const apiBatchQueueItem = <T, M>(itemPayload: T, itemMeta: M): ApiBatchQueueItemAction<T, M> => {
    const meta = {
        ...itemMeta,
        passthrough: {
            apiBatchQueueItem: true
        }
    };
    return {
        type: API,
        payload: itemPayload,
        meta
    };
};

export const apiBatchHandleLastItemSuccess = () => ({ type: ActionTypes.API_BATCH_LAST_ITEM_SUCCESS });

export const apiBatchHandleLastItemFailure = () => ({ type: ActionTypes.API_BATCH_LAST_ITEM_FAILURE });
