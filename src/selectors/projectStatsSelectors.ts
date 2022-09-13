// externals
import { createSelector } from "reselect";

// interfaces/types
import type { ProjectStatsState } from "../reducers/projectStatsReducer";

// state
import { StateTree } from "../reducers/rootReducer";

const projectStats = (state: StateTree): ProjectStatsState => state.projectStats;

export const getTotalSprintCount = createSelector(
    [projectStats],
    (projectStats: ProjectStatsState): number | null => projectStats.totalSprintCount
);
export const getArchivedSprintCount = createSelector(
    [projectStats],
    (projectStats: ProjectStatsState): number | null => projectStats.archivedSprintCount
);
