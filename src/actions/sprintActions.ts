// externals
import type { Action } from "redux";

// actions

// consts/enums
import * as ActionTypes from "./actionTypes";
import { SprintDetailShowingPicker } from "../components/organisms/forms/SprintDetailForm";

// interfaces/types
import type { SprintDetailFormEditableFieldsWithInstanceId } from "../components/organisms/forms/SprintDetailForm";
import type { ApiSprintStats } from "../types/apiModelTypes";
import type { SaveableSprint } from "../reducers/sprints/sprintsReducerTypes";

export type CollapseSprintPanelAction = {
    type: typeof ActionTypes.COLLAPSE_SPRINT_PANEL;
    payload: {
        sprintId: string;
    };
};

export type ExpandSprintPanelAction = {
    type: typeof ActionTypes.EXPAND_SPRINT_PANEL;
    payload: {
        sprintId: string;
    };
};

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

export type AddNewSprintFormActionPayload = {
    instanceId: number;
    position: NewSprintPosition;
};
export type AddNewSprintFormAction = Action<typeof ActionTypes.ADD_SPRINT_FORM> & {
    payload: AddNewSprintFormActionPayload;
};
export const addNewSprintForm = (position: NewSprintPosition): AddNewSprintFormAction => ({
    type: ActionTypes.ADD_SPRINT_FORM,
    payload: {
        instanceId: ++lastInstanceId,
        position
    }
});

export type AddSprintActionPayload = {
    sprint: SaveableSprint;
    position: NewSprintPosition;
};
export type AddSprintAction = {
    type: typeof ActionTypes.ADD_SPRINT;
    payload: AddSprintActionPayload;
};
export const addSprint = (sprint: SaveableSprint, position: NewSprintPosition): AddSprintAction => ({
    type: ActionTypes.ADD_SPRINT,
    payload: {
        sprint,
        position
    }
});

export type UpdateSprintFieldsAction = {
    type: typeof ActionTypes.UPDATE_SPRINT_FIELDS;
    payload: SprintDetailFormEditableFieldsWithInstanceId;
};
export const updateSprintFields = (fields: SprintDetailFormEditableFieldsWithInstanceId): UpdateSprintFieldsAction => ({
    type: ActionTypes.UPDATE_SPRINT_FIELDS,
    payload: fields
});

export type CancelUnsavedSprintActionPayload = {
    instanceId: number;
};
export type CancelUnsavedSprintAction = {
    type: typeof ActionTypes.CANCEL_UNSAVED_SPRINT;
    payload: CancelUnsavedSprintActionPayload;
};
export const cancelUnsavedSprint = (instanceId: number): CancelUnsavedSprintAction => ({
    type: ActionTypes.CANCEL_UNSAVED_SPRINT,
    payload: {
        instanceId
    }
});

export type CancelEditSprintActionPayload = {
    itemId: string;
};
export type CancelEditSprintAction = {
    type: typeof ActionTypes.CANCEL_EDIT_SPRINT;
    payload: CancelEditSprintActionPayload;
};
export const cancelEditSprint = (itemId: string): CancelEditSprintAction => ({
    type: ActionTypes.CANCEL_EDIT_SPRINT,
    payload: {
        itemId
    }
});

export type SaveNewSprintActionPayload = {
    instanceId: number;
};
export type SaveNewSprintAction = {
    type: typeof ActionTypes.SAVE_NEW_SPRINT;
    payload: SaveNewSprintActionPayload;
};
export const saveNewSprint = (instanceId: number): SaveNewSprintAction => ({
    type: ActionTypes.SAVE_NEW_SPRINT,
    payload: {
        instanceId
    }
});

export type UpdateSprintActionPayload = {
    id: string;
};
export type UpdateSprintAction = {
    type: typeof ActionTypes.UPDATE_SPRINT;
    payload: UpdateSprintActionPayload;
};
export const updateSprint = (id: string): UpdateSprintAction => ({
    type: ActionTypes.UPDATE_SPRINT,
    payload: {
        id
    }
});

export type ToggleSprintDetailPayload = {
    sprintId: string;
    strictMode: boolean;
};

export type ToggleSprintDetailAction = {
    type: typeof ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL;
    payload: ToggleSprintDetailPayload;
};

export const sprintDetailClick = (sprintId: string, strictMode: boolean): ToggleSprintDetailAction => ({
    type: ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL,
    payload: {
        sprintId,
        strictMode
    }
});

export type UpdateSprintStatsActionPayload = {
    sprintId: string;
    sprintStats: ApiSprintStats;
};

export type UpdateSprintStatsAction = {
    type: typeof ActionTypes.UPDATE_SPRINT_STATS;
    payload: UpdateSprintStatsActionPayload;
};

export const updateSprintStats = (sprintId: string, sprintStats: ApiSprintStats): UpdateSprintStatsAction => ({
    type: ActionTypes.UPDATE_SPRINT_STATS,
    payload: {
        sprintId,
        sprintStats
    }
});

export type EditSprintPayload = {
    sprintId: string;
};

export type EditSprintAction = {
    type: typeof ActionTypes.EDIT_SPRINT;
    payload: EditSprintPayload;
};

export const editSprint = (sprintId: string): EditSprintAction => ({
    type: ActionTypes.EDIT_SPRINT,
    payload: {
        sprintId
    }
});

export type ShowSprintRangeDatePickerAction = {
    type: typeof ActionTypes.SHOW_SPRINT_RANGE_DATE_PICKER;
    payload: {
        showPicker: SprintDetailShowingPicker;
        sprintId: string | null;
    };
};

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
