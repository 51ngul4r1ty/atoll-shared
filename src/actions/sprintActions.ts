// actions
import * as ActionTypes from "./actionTypes";

export interface CollapseSprintPanelAction {
    type: typeof ActionTypes.COLLAPSE_SPRINT_PANEL;
    payload: {
        sprintId: string;
    };
}

export interface ExpandSprintPanelAction {
    type: typeof ActionTypes.EXPAND_SPRINT_PANEL;
    payload: {
        sprintId: string;
    };
}

export const collapseSprintPanel = (sprintId: string): CollapseSprintPanelAction => ({
    type: ActionTypes.COLLAPSE_SPRINT_PANEL,
    payload: {
        sprintId
    }
});

export const expandSprintPanel = (sprintId: string): ExpandSprintPanelAction => ({
    type: ActionTypes.EXPAND_SPRINT_PANEL,
    payload: {
        sprintId
    }
});
