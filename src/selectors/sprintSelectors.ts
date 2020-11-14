// interfaces/types
import { Sprint } from "../reducers/sprintsReducer";
import { SprintCardSprint, SprintStatus } from "../components/molecules/cards/sprintCard/sprintCardTypes";

// state
import { StateTree } from "../reducers/rootReducer";
import { getBacklogItemsForSprint } from "./sprintBacklogSelectors";

// utils
import { getSprintById as getSprintByIdReducer } from "../reducers/sprintsReducer";

export const determineSprintStatus = (sprint: Sprint): SprintStatus => {
    const currentTime = new Date().getTime();
    const afterSprintStart = currentTime >= sprint.startDate.getTime();
    const beforeSprintFinish = currentTime < sprint.finishDate.getTime();
    if (afterSprintStart && beforeSprintFinish) {
        return SprintStatus.InProgress;
    } else if (afterSprintStart) {
        // actually, this condition means "After Sprint Finish"
        return SprintStatus.Completed;
    } else {
        // and this condition means "Before Sprint Start"
        return SprintStatus.NotStarted;
    }
};

export const getPlanViewSprints = (state: StateTree): SprintCardSprint[] => {
    const result = state.sprints.allItems.map((sprint) => {
        const panelSprint: SprintCardSprint = {
            id: sprint.id,
            name: sprint.name,
            startDate: sprint.startDate,
            finishDate: sprint.finishDate,
            status: determineSprintStatus(sprint),
            plannedPoints: sprint.plannedPoints,
            acceptedPoints: sprint.acceptedPoints,
            velocityPoints: sprint.velocityPoints,
            usedSplitPoints: sprint.usedSplitPoints,
            remainingSplitPoints: sprint.remainingSplitPoints,
            expanded: sprint.expanded,
            backlogItems: getBacklogItemsForSprint(state, sprint.id),
            backlogItemsLoaded: sprint.backlogItemsLoaded,
            editing: sprint.editing,
            saved: sprint.saved,
            instanceId: sprint.instanceId
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
