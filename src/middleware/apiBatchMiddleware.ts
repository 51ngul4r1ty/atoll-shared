/**
 * Purpose: To co-ordinate the API batch calling process.
 * Reason to change: When new RESTful API calls are needed.
 */

// externals
import { Action, Store } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import {
    apiBatchHandleLastItemFailure,
    apiBatchHandleLastItemSuccess,
    apiBatchProcessQueue,
    apiBatchQueueItem,
    ApiBatchQueueItemAction
} from "../actions/apiOrchestrationActions";
import { getRemainingApiCalls } from "../selectors/apiBatchSelectors";

// state
import { StateTree } from "../reducers/rootReducer";

// TODO: Define types for "store", "next" etc. - and do this in other files too!
export const apiBatchMiddleware = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    const actionTyped = action as ApiBatchQueueItemAction<any, any>;
    if (actionTyped.meta?.passthrough?.apiBatchQueueItem) {
        const actionStage = actionTyped.meta?.apiActionStage;
        switch (actionStage) {
            case "success": {
                storeTyped.dispatch(apiBatchHandleLastItemSuccess());
                break;
            }
            case "failure": {
                storeTyped.dispatch(apiBatchHandleLastItemFailure());
                break;
            }
        }
    } else {
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
                    storeTyped.dispatch(apiBatchQueueItem(firstApiCall.payload, firstApiCall.meta));
                }
                break;
            }
            case ActionTypes.API_BATCH_LAST_ITEM_SUCCESS: {
                storeTyped.dispatch(apiBatchProcessQueue());
                break;
            }
            default: {
                // do nothing
                break;
            }
        }
    }
};
