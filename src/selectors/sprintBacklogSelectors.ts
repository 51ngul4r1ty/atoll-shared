// interfaces/types
import { StateTree } from "../reducers/rootReducer";

// reducers
import {
    getSprintBacklogItemById as getSprintBacklogItemByIdFromReducer,
    SprintBacklogItem
} from "../reducers/sprintBacklogReducer";

export const getBacklogItemsForSprint = (state: StateTree, sprintId: string): SprintBacklogItem[] | null => {
    const sprintData = state.sprintBacklog.sprints[sprintId];
    if (!sprintData) {
        return null;
    }
    return sprintData.items;
};

export interface OpenedDetailMenuInfo {
    backlogItemId: string;
    sprintId: string;
}

export const getOpenedDetailMenuInfo = (state: StateTree): OpenedDetailMenuInfo => ({
    backlogItemId: state.sprintBacklog.openedDetailMenuBacklogItemId,
    sprintId: state.sprintBacklog.openedDetailMenuSprintId
});

export const getSprintBacklogItemById = (state: StateTree, sprintId: string, backlogItemId: string) => {
    return getSprintBacklogItemByIdFromReducer(state.sprintBacklog, sprintId, backlogItemId);
};
