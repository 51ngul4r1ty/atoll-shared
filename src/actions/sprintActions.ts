// actions
import { SaveableSprint } from "../reducers/sprintsReducer";

// consts/enums
import * as ActionTypes from "./actionTypes";

// interfaces/types
import { SprintDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/SprintDetailForm";

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

export interface UpdateSprintFieldsAction {
    type: typeof ActionTypes.UPDATE_SPRINT_FIELDS;
    payload: SprintDetailFormEditableFieldsWithInstanceId;
}
export const updateSprintFields = (fields: SprintDetailFormEditableFieldsWithInstanceId): UpdateSprintFieldsAction => ({
    type: ActionTypes.UPDATE_SPRINT_FIELDS,
    payload: fields
});

export interface CancelUnsavedSprintActionPayload {
    instanceId: number;
}
export interface CancelUnsavedSprintAction {
    type: typeof ActionTypes.CANCEL_UNSAVED_SPRINT;
    payload: CancelUnsavedSprintActionPayload;
}
export const cancelUnsavedSprint = (instanceId: number): CancelUnsavedSprintAction => ({
    type: ActionTypes.CANCEL_UNSAVED_SPRINT,
    payload: {
        instanceId
    }
});

export interface CancelEditSprintActionPayload {
    itemId: string;
}
export interface CancelEditSprintAction {
    type: typeof ActionTypes.CANCEL_EDIT_SPRINT;
    payload: CancelEditSprintActionPayload;
}
export const cancelEditSprint = (itemId: string): CancelEditSprintAction => ({
    type: ActionTypes.CANCEL_EDIT_SPRINT,
    payload: {
        itemId
    }
});
