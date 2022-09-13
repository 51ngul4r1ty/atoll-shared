// externals
import { produce } from "immer";

// interfaces/types
import type { AnyFSA } from "../types/reactHelperTypes";
import type { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

export type ProjectStatsState = Readonly<{
    totalSprintCount: number | null;
    archivedSprintCount: number | null;
}>;

export const projectStatsReducerInitialState = Object.freeze<ProjectStatsState>({
    totalSprintCount: null,
    archivedSprintCount: null
});

export const projectStatsReducer = (
    state: ProjectStatsState = projectStatsReducerInitialState,
    action: AnyFSA
): ProjectStatsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const projectStats = actionTyped.payload.response.data.projectStats;
                draft.totalSprintCount = projectStats?.totalSprintCount || null;
                draft.archivedSprintCount = projectStats?.archivedSprintCount || null;
                return;
            }
            // TODO: Update stats when sprints are added & removed
            // NOTE: There are 2 approaches- 1) dispatch UPDATE_PROJECT_STATS action; 2) listen for all other actions
            //       What is the better way and why is that the better way?
        }
    });
