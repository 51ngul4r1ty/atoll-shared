// actions
import { SaveableSprint } from "../reducers/sprintsReducer";
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

// let lastInstanceId = 0;

// export interface AddNewSprintActionPayload {
//     instanceId: number;
// }
// export interface AddNewSprintAction {
//     type: typeof ActionTypes.ADD_SPRINT_FORM;
//     payload: AddNewSprintActionPayload;
// }
// // TODO: This should be renamed??
// export const addNewSprint = (): AddNewSprintAction => ({
//     type: ActionTypes.ADD_SPRINT_FORM,
//     payload: {
//         instanceId: ++lastInstanceId
//     }
// });

export enum NewSprintPosition {
    None = 0,
    Before = 1,
    After = 2
}

let lastInstanceId = 0;

export interface AddNewSprintFormActionPayload {
    instanceId: number;
    position: NewSprintPosition;
}
export interface AddNewSprintFormAction {
    type: typeof ActionTypes.ADD_SPRINT_FORM;
    payload: AddNewSprintFormActionPayload;
}
export const addNewSprintForm = (position: NewSprintPosition): AddNewSprintFormAction => ({
    type: ActionTypes.ADD_SPRINT_FORM,
    payload: {
        instanceId: ++lastInstanceId,
        position
    }
});

export interface AddSprintActionPayload {
    sprint: SaveableSprint;
    position: NewSprintPosition;
}
export interface AddSprintAction {
    type: typeof ActionTypes.ADD_SPRINT_FORM;
    payload: AddSprintActionPayload;
}
// TODO: When addNewSprint is renamed, also rename this
export const addSprint = (sprint: SaveableSprint, position: NewSprintPosition) => ({
    type: ActionTypes.ADD_SPRINT,
    payload: {
        sprint,
        position
    }
});
