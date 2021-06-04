// interfaces/types
import { BacklogItemRank } from "../reducers/backlogItemRanksReducer";

// state
import { StateTree } from "../reducers/rootReducer";

export const getBacklogItemRanks = (state: StateTree): BacklogItemRank[] => {
    return state.backlogItemRanks.items;
};
