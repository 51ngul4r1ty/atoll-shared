// interfaces/types
import { StateTree } from "../types";
import { SprintPlanningPanelSprint, SprintStatus } from "../components/organisms/panels/SprintPlanningPanel";

export const getPlanViewSprints = (state: StateTree): SprintPlanningPanelSprint[] => {
    const result = state.sprints.items.map((sprint) => {
        const panelSprint: SprintPlanningPanelSprint = {
            name: sprint.name,
            startDate: sprint.startdate,
            finishDate: sprint.finishdate,
            status: SprintStatus.NotStarted // TODO: Add status to the database
        };
        return panelSprint;
    });
    return result;
};
