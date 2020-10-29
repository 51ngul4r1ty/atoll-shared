/**
 * Purpose: To co-ordinate the API batch calling process.
 * Reason to change: When new RESTful API calls are needed.
 */

// externals
import { Action, Store } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { apiBatchProcessQueue, ApiBatchQueueItemAction } from "../actions/apiOrchestrationActions";
import { getRemainingApiCalls } from "../selectors/apiBatchSelectors";
import { API } from "./apiTypes";

// state
import { StateTree } from "../reducers/rootReducer";

// TODO: Define types for "store", "next" etc. - and do this in other files too!
export const apiBatchMiddleware = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    const actionTyped = action as ApiBatchQueueItemAction<any, any>;
    if (actionTyped.meta?.passthrough?.apiBatchQueueItem) {
        // It should also have actionTyped.meta.apiActionStage - USE THAT
        debugger;
    }
    switch (action.type) {
        case ActionTypes.API_BATCH: {
            storeTyped.dispatch(apiBatchProcessQueue());
            break;
        }
        case ActionTypes.API_BATCH_PROCESS_QUEUE: {
            const state = storeTyped.getState();
            const apiCalls = getRemainingApiCalls(state);
            if (!apiCalls.length) {
                // TODO: Finish this
                // signals the end of the batch, at this point we can report success
            } else {
                const firstApiCall = apiCalls[0];
                storeTyped.dispatch({
                    type: API,
                    payload: firstApiCall.payload,
                    meta: {
                        ...firstApiCall.meta,
                        passthrough: {
                            apiBatchQueueItem: true
                        }
                    }
                });
            }
            break;
        }
    }
};
