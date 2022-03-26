// externals
import { createSelector } from "reselect";

// interfaces/types
import { StateTree } from "../reducers/rootReducer";
import { BacklogItemInSprint } from "../types/backlogItemTypes";

// reducers
import {
    getSprintBacklogItemById as getSprintBacklogItemByIdFromReducer,
    SprintBacklogState
} from "../reducers/sprintBacklogReducer";
import { getSelectedBacklogItemIdsFromSlice } from "../reducers/backlogItems/backlogItemsSliceSelectors";
import { BacklogItemsState } from "../reducers/backlogItems/backlogItemsReducerTypes";

export const backlogItems = (state: { backlogItems: BacklogItemsState }): BacklogItemsState => state.backlogItems;
export const sprintBacklog = (state: { sprintBacklog: SprintBacklogState }): SprintBacklogState => state.sprintBacklog;

export const getBacklogItemsForSprint = (state: StateTree, sprintId: string): BacklogItemInSprint[] | null => {
    const sprintData = state.sprintBacklog.sprints[sprintId];
    if (!sprintData) {
        return null;
    }
    return sprintData.items;
};

export interface OpenedOrOpeningDetailMenuInfo {
    backlogItemId: string;
    sprintId: string;
}

export const getOpenedDetailMenuInfo = (state: StateTree): OpenedOrOpeningDetailMenuInfo => ({
    backlogItemId: state.sprintBacklog.openedDetailMenuBacklogItemId,
    sprintId: state.sprintBacklog.openedDetailMenuSprintId
});

export const getOpeningDetailMenuInfo = (state: StateTree): OpenedOrOpeningDetailMenuInfo => ({
    backlogItemId: state.sprintBacklog.openingDetailMenuBacklogItemId,
    sprintId: state.sprintBacklog.openingDetailMenuSprintId
});

export const getSprintBacklogItemById = (state: StateTree, sprintId: string, backlogItemId: string) => {
    return getSprintBacklogItemByIdFromReducer(state.sprintBacklog, sprintId, backlogItemId);
};

export const getIncludeArchivedSprints = createSelector(
    [sprintBacklog],
    (sprintBacklog: SprintBacklogState): boolean => sprintBacklog.includeArchivedSprints
);

export const isSplitInProgress = createSelector(
    [sprintBacklog],
    (sprintBacklog: SprintBacklogState): boolean => sprintBacklog.splitInProgress
);

export const lookupPartIdForBacklogItemInSprint = (state: StateTree, sprintId: string, backlogItemId: string): string | null => {
    const sprintBacklogItem = getSprintBacklogItemById(state, sprintId, backlogItemId);
    return sprintBacklogItem.backlogItemPartId || null;
};

// TODO: Move this to a selector
export const backlogItemIsInSprint = (sprintBacklog: SprintBacklogState, backlogItemId: string, sprintId: string): boolean => {
    const sprintInfo = sprintBacklog.sprints[sprintId];
    return sprintInfo.backlogItemsInSprint[backlogItemId] || false;
};

export const getSprintsToDisableAddItemsAction = createSelector(
    [backlogItems, sprintBacklog],
    (backlogItems: BacklogItemsState, sprintBacklog: SprintBacklogState) => {
        const selectedBacklogItemIds = getSelectedBacklogItemIdsFromSlice(backlogItems);
        const sprintIds = Object.keys(sprintBacklog.sprints).filter((sprintId) => {
            const selectedBacklogItemsInSomeSprints = selectedBacklogItemIds.some((backlogItemId) =>
                backlogItemIsInSprint(sprintBacklog, backlogItemId, sprintId)
            );
            return selectedBacklogItemsInSomeSprints;
        });
        return sprintIds;
    }
);
