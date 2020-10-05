import { StateTree } from "../types";

export const getBacklogItemRanks = (state: StateTree) => {
    return state.backlogItemRanks.items;
};
