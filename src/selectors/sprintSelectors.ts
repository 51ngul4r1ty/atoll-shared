// interfaces/types
import { Sprint } from "../reducers/sprintsReducer";
import { SprintPlanningPanelSprint, SprintStatus } from "../components/organisms/panels/SprintPlanningPanel";
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
            name: sprint.name,
            startDate: sprint.startDate,
            finishDate: sprint.finishDate,
            status: determineSprintStatus(sprint)
        };
        return panelSprint;
    });
    return result;
};
