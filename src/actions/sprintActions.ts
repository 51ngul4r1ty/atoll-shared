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

let lastInstanceId = 0;

export interface AddNewSprintActionPayload {
    instanceId: number;
}
export interface AddNewSprintAction {
    type: typeof ActionTypes.ADD_SPRINT;
    payload: AddNewSprintActionPayload;
}
export const addNewSprint = (): AddNewSprintAction => ({
    type: ActionTypes.ADD_SPRINT,
    payload: {
        instanceId: ++lastInstanceId
    }
});
