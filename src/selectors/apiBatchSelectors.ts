// state
import { StateTree } from "../reducers/rootReducer";

// interfaces/types
import { BatchApiCall } from "../middleware/apiBatchTypes";

export const getRemainingApiCalls = (state: StateTree): BatchApiCall<any, any>[] => {
    return state.apiBatch?.remainingApiCalls || ([] as BatchApiCall<any, any>[]);
};
