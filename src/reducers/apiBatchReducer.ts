// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { ApiBatchAddBacklogItemsToSprintAction } from "../actions/apiSprintBacklog";
import { BatchApiCall } from "../middleware/apiBatchTypes";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";

export interface ApiBatchState {
    remainingApiCalls: BatchApiCall<any, any>[];
}

export const apiBatchReducerInitialState = Object.freeze<ApiBatchState>({
    remainingApiCalls: []
});

export const apiBatchReducer = (state: ApiBatchState = apiBatchReducerInitialState, action: AnyFSA): ApiBatchState =>
    produce(state, (draft) => {
        switch (action.type) {
            case ActionTypes.API_BATCH: {
                const apiBatchAction = action as ApiBatchAddBacklogItemsToSprintAction;
                if (!apiBatchAction.calls) {
                    throw new Error("Unexpected condition- apiBatchAction.calls is undefined processing API_BATCH action");
                }
                apiBatchAction.calls.forEach((call) => {
                    draft.remainingApiCalls.push(call);
                });
                return;
            }
            case ActionTypes.API_BATCH_LAST_ITEM_SUCCESS: {
                draft.remainingApiCalls.splice(0, 1);
                return;
            }
            case ActionTypes.API_BATCH_LAST_ITEM_FAILURE: {
                draft.remainingApiCalls = [];
                return;
            }
        }
    });
