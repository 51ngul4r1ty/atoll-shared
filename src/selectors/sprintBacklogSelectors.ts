// externals
import { createSelector } from "reselect";

// interfaces/types
import type { StateTree } from "../reducers/rootReducer";
import type { BacklogItemInSprint } from "../types/backlogItemTypes";
import type { BacklogItemsState } from "../reducers/backlogItems/backlogItemsReducerTypes";

// selectors
import * as sprintBacklogItemSliceSelectors from "../reducers/sprintBacklog/sprintBacklogSliceSelectors";
import * as backlogItemSliceSelectors from "../reducers/backlogItems/backlogItemsSliceSelectors";

// reducers
import { getSprintBacklogItemByIdFromSlice, SprintBacklogState } from "../reducers/sprintBacklog/sprintBacklogReducer";

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

export const getSprintBacklogOpenedDetailMenuInfo = (state: StateTree): OpenedOrOpeningDetailMenuInfo => ({
    backlogItemId: state.sprintBacklog.openedDetailMenuBacklogItemId,
    sprintId: state.sprintBacklog.openedDetailMenuSprintId
});

export const getSprintBacklogOpeningDetailMenuInfo = (state: StateTree): OpenedOrOpeningDetailMenuInfo => ({
    backlogItemId: state.sprintBacklog.openingDetailMenuBacklogItemId,
    sprintId: state.sprintBacklog.openingDetailMenuSprintId
});

export const getSprintBacklogOpenedDetailMenuItemId = (state: StateTree): string | null =>
    state.sprintBacklog.openedDetailMenuBacklogItemId;

export const getSprintBacklogOpeningDetailMenuItemId = (state: StateTree): string | null =>
    state.sprintBacklog.openingDetailMenuBacklogItemId;

export const getSprintBacklogItemById = (state: StateTree, sprintId: string, backlogItemId: string) => {
    return getSprintBacklogItemByIdFromSlice(state.sprintBacklog, sprintId, backlogItemId);
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
    return sprintBacklogItem.backlogItemPartId ?? null;
};

export const getSprintsToDisableAddItemsAction = createSelector(
    [backlogItems, sprintBacklog],
    (backlogItems: BacklogItemsState, sprintBacklog: SprintBacklogState) => {
        const selectedBacklogItemIds = backlogItemSliceSelectors.sliceSelectSelectedBacklogItemIds(backlogItems);
        const sprintIds = Object.keys(sprintBacklog.sprints).filter((sprintId) => {
            const selectedBacklogItemsInSomeSprints = selectedBacklogItemIds.some((backlogItemId) =>
                sprintBacklogItemSliceSelectors.sliceSelectBacklogItemIsInSprint(sprintBacklog, backlogItemId, sprintId)
            );
            return selectedBacklogItemsInSomeSprints;
        });
        return sprintIds;
    }
);
