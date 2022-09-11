/**
 * Purpose: Handle updates to UI state for Projects and Project Items.
 * Reason to change: When Project UI state is more complex than simple state updates (for example, involves API calls).
 */

// externals
import type { Action } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { apiGetProjects } from "../actions/apiProjects";
import { apiPatchUserPreferences, ApiPatchUserPrefsSuccessAction, PatchUserPrefsCallReason } from "../actions/apiUserActions";
import { projectPickerClosed, ProjectPickerSwitchProjectAction } from "../actions/projectActions";
import { getCurrentProjectId } from "../selectors/userSelectors";

import type { StoreTyped } from "../types/reduxHelperTypes";

export const projectMiddleware = (store: StoreTyped) => (next) => (action: Action) => {
    next(action);
    switch (action.type) {
        case ActionTypes.PROJECT_PICKER_OPENED: {
            store.dispatch(apiGetProjects());
            return;
        }
        case ActionTypes.SWITCH_PROJECT: {
            const actionTyped = action as ProjectPickerSwitchProjectAction;
            store.dispatch(
                apiPatchUserPreferences(
                    {
                        selectedProject: actionTyped.payload.projectId
                    },
                    PatchUserPrefsCallReason.SwitchProject
                )
            );
            return;
        }
        case ActionTypes.API_PATCH_USER_PREFS_SUCCESS: {
            store.dispatch(projectPickerClosed());
            const actionTyped = action as ApiPatchUserPrefsSuccessAction;
            const apiCallReason = actionTyped.meta.passthrough.apiCallReason;
            if (apiCallReason === PatchUserPrefsCallReason.SwitchProject) {
                const state = store.getState();
                const currentProjectId = getCurrentProjectId(state);
                const newProjectId = actionTyped.payload.response.data.item.settings.selectedProject;
                if (newProjectId !== currentProjectId) {
                    document.location.reload();
                }
            }
        }
        case ActionTypes.API_PATCH_USER_PREFS_FAILURE: {
            store.dispatch(projectPickerClosed());
            break;
        }
    }
};
