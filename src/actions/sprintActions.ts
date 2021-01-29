// actions
import { SaveableSprint } from "../reducers/sprintsReducer";

// consts/enums
import * as ActionTypes from "./actionTypes";

// interfaces/types
import {
    SprintDetailFormEditableFieldsWithInstanceId,
    SprintDetailShowingPicker
} from "../components/organisms/forms/SprintDetailForm";
import { ApiSprintStats } from "../apiModelTypes";

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
    type: typeof ActionTypes.ADD_SPRINT;
    payload: AddSprintActionPayload;
}
export const addSprint = (sprint: SaveableSprint, position: NewSprintPosition): AddSprintAction => ({
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

export interface SaveNewSprintActionPayload {
    instanceId: number;
}
export interface SaveNewSprintAction {
    type: typeof ActionTypes.SAVE_NEW_SPRINT;
    payload: SaveNewSprintActionPayload;
}
export const saveNewSprint = (instanceId: number): SaveNewSprintAction => ({
    type: ActionTypes.SAVE_NEW_SPRINT,
    payload: {
        instanceId
    }
});

export interface UpdateSprintActionPayload {
    id: string;
}
export interface UpdateSprintAction {
    type: typeof ActionTypes.UPDATE_SPRINT;
    payload: UpdateSprintActionPayload;
}
export const updateSprint = (id: string): UpdateSprintAction => ({
    type: ActionTypes.UPDATE_SPRINT,
    payload: {
        id
    }
});

export interface ToggleSprintDetailPayload {
    sprintId: string;
}

export interface ToggleSprintDetailAction {
    type: typeof ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL;
    payload: ToggleSprintDetailPayload;
}

export const sprintDetailClick = (sprintId: string): ToggleSprintDetailAction => ({
    type: ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL,
    payload: {
        sprintId
    }
});

export interface UpdateSprintStatsActionPayload {
    sprintId: string;
    sprintStats: ApiSprintStats;
}

export interface UpdateSprintStatsAction {
    type: typeof ActionTypes.UPDATE_SPRINT_STATS;
    payload: UpdateSprintStatsActionPayload;
}

export const updateSprintStats = (sprintId: string, sprintStats: ApiSprintStats): UpdateSprintStatsAction => ({
    type: ActionTypes.UPDATE_SPRINT_STATS,
    payload: {
        sprintId,
        sprintStats
    }
});

export interface EditSprintPayload {
    sprintId: string;
}

export interface EditSprintAction {
    type: typeof ActionTypes.EDIT_SPRINT;
    payload: EditSprintPayload;
}

export const editSprint = (sprintId: string): EditSprintAction => ({
    type: ActionTypes.EDIT_SPRINT,
    payload: {
        sprintId
    }
});

export interface ShowSprintRangeDatePickerAction {
    type: typeof ActionTypes.SHOW_SPRINT_RANGE_DATE_PICKER;
    payload: {
        showPicker: SprintDetailShowingPicker;
        sprintId: string | null;
    };
}

export const showSprintRangeDatePicker = (sprintId: string, showPicker: SprintDetailShowingPicker) => ({
    type: ActionTypes.SHOW_SPRINT_RANGE_DATE_PICKER,
    payload: {
        showPicker,
        sprintId
    }
});

export const hideSprintRangeDatePicker = () => ({
    type: ActionTypes.HIDE_SPRINT_RANGE_DATE_PICKER
});
