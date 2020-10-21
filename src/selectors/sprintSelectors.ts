// interfaces/types
import { Sprint } from "../reducers/sprintsReducer";
import { SprintPlanningPanelSprint, SprintStatus } from "../components/organisms/panels/sprintPlanning/sprintPlanningPanelTypes";

// state
import { StateTree } from "../reducers/rootReducer";

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

export const getPlanViewSprints = (state: StateTree): SprintPlanningPanelSprint[] => {
    const result = state.sprints.items.map((sprint) => {
        const panelSprint: SprintPlanningPanelSprint = {
            id: sprint.id,
            expanded: sprint.expanded,
            name: sprint.name,
            startDate: sprint.startDate,
            finishDate: sprint.finishDate,
            status: determineSprintStatus(sprint),
            plannedPoints: sprint.plannedPoints,
            acceptedPoints: sprint.acceptedPoints,
            velocityPoints: sprint.velocityPoints,
            usedSplitPoints: sprint.usedSplitPoints,
            remainingSplitPoints: sprint.remainingSplitPoints
        };
        return panelSprint;
    });
    return result;
};
