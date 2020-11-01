// interfaces/types
import { StateTree } from "../reducers/rootReducer";
import { SprintBacklogItem } from "../reducers/sprintBacklogReducer";

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
