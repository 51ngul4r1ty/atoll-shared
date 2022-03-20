// consts/enums
import { API } from "../middleware/apiConsts";

// actions
import * as ActionTypes from "./actionTypes";

export interface ApiBatchProcessQueueAction {
    type: typeof ActionTypes.API_BATCH_PROCESS_QUEUE;
}

export const apiBatchProcessQueue = () => ({ type: ActionTypes.API_BATCH_PROCESS_QUEUE });

// NOTE: Currently nothing uses this- it is intended for future use
export const apiBatchCompleted = () => ({ type: ActionTypes.API_BATCH_COMPLETED });

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
