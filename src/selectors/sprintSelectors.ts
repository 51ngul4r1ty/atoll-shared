// externals
import { createSelector } from "reselect";

// interfaces/types
import type { Sprint } from "../reducers/sprints/sprintsReducerTypes";
import type { SprintsState } from "../reducers/sprints/sprintsReducer";
import type { SprintCardSprint } from "../components/molecules/cards/sprintCard/sprintCardTypes";

// state
import { StateTree } from "../reducers/rootReducer";
import { getBacklogItemsForSprint } from "./sprintBacklogSelectors";

// utils
import { getSprintById as getSprintByIdReducer } from "../reducers/sprints/sprintsReducerHelper";
import { determineSprintStatus } from "../utils/sprintStatusHelper";

const sprints = (state: StateTree): SprintsState => state.sprints;

export const getPlanViewSprints = (state: StateTree, includeArchived: boolean): SprintCardSprint[] => {
    const result = state.sprints.allItems
        .filter((item) => (includeArchived && item.archived) || !item.archived)
        .map((sprint) => {
            const panelSprint: SprintCardSprint = {
                acceptedPoints: sprint.acceptedPoints,
                archived: sprint.archived,
                backlogItems: getBacklogItemsForSprint(state, sprint.id),
                backlogItemsLoaded: sprint.backlogItemsLoaded,
                editing: sprint.editing,
                expanded: sprint.expanded,
                finishDate: sprint.finishDate,
                id: sprint.id,
                instanceId: sprint.instanceId,
                name: sprint.name,
                plannedPoints: sprint.plannedPoints,
                remainingSplitPoints: sprint.remainingSplitPoints,
                saved: sprint.saved,
                startDate: sprint.startDate,
                status: determineSprintStatus(sprint.startDate, sprint.finishDate),
                totalPoints: sprint.totalPoints,
                usedSplitPoints: sprint.usedSplitPoints,
                velocityPoints: sprint.velocityPoints
            };
            return panelSprint;
        });
    return result;
};

export const getSprintById = (state: StateTree, sprintId: string): Sprint | null => {
    return getSprintByIdReducer(state.sprints, sprintId);
};

export const getSprints = (state: StateTree): Sprint[] => state.sprints.allItems;

export const getFirstSprint = (state: StateTree): Sprint => {
    const items = getSprints(state);
    if (!items.length) {
        return null;
    }
    const firstItem = items[0];
    return firstItem;
};

export const getLastSprint = (state: StateTree): Sprint => {
    const items = getSprints(state);
    if (!items.length) {
        return null;
    }
    const lastItem = items[items.length - 1];
    return lastItem;
};

export const getNextSprint = (state: StateTree, sprintId: string): Sprint | null => {
    const sprints = getSprints(state);
    if (!sprints.length) {
        return null;
    }
    let returnNext = false;
    let nextSprint: Sprint = null;
    sprints.forEach((sprint) => {
        if (returnNext && !nextSprint) {
            nextSprint = sprint;
        }
        if (sprint.id === sprintId) {
            returnNext = true;
        }
    });
    return nextSprint;
};

export const getSprintByInstanceId = (state: StateTree, instanceId: number): Sprint | null => {
    const matchingItems = state.sprints.addedItems.filter((addedItem) => addedItem.instanceId === instanceId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem;
    } else {
        return null;
    }
};

export const getOpenedDetailMenuSprintId = (state: StateTree) => state.sprints.openedDetailMenuSprintId;

export const getOpenedDatePickerInfo = (state: StateTree) => state.sprints.openedDatePickerInfo;

export const getSplitToNextSprintAvailable = (state: StateTree) => state.sprints.splitToNextSprintAvailable;

export const getTotalSprintCount = createSelector([sprints], (sprints: SprintsState): number | null => sprints.totalSprintCount);
export const getArchivedSprintCount = createSelector(
    [sprints],
    (sprints: SprintsState): number | null => sprints.archivedSprintCount
);
