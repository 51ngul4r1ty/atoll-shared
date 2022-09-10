/**
 * Purpose: Handle updates to UI state for Projects and Project Items.
 * Reason to change: When Project UI state is more complex than simple state updates (for example, involves API calls).
 */

// externals
import type { Action } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { apiGetProjects, ApiGetProjectsSuccessAction } from "../actions/apiProjects";
import { ProjectPickerOpenedAction } from "../actions/projectActions";

import type { StoreTyped } from "../types/reduxHelperTypes";

export const projectMiddleware = (store: StoreTyped) => (next) => (action: Action) => {
    next(action);
    switch (action.type) {
        case ActionTypes.PROJECT_PICKER_OPENED: {
            store.dispatch(apiGetProjects());
            return;
        }
    }
};
