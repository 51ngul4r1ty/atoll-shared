import { StateTree } from "../reducers/rootReducer";

export const getBacklogItemRanks = (state: StateTree) => {
    return state.backlogItemRanks.items;
};
