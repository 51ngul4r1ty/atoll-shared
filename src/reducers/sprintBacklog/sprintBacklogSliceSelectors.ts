// interfaces/types
import type { SprintBacklogState } from "./sprintBacklogReducer";

export const sliceSelectBacklogItemIsInSprint = (
    sprintBacklog: SprintBacklogState,
    backlogItemId: string,
    sprintId: string
): boolean => {
    const sprintInfo = sprintBacklog.sprints[sprintId];
    return sprintInfo.backlogItemsInSprint[backlogItemId] || false;
};
