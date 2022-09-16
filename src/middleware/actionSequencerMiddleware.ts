/**
 * Purpose: When a sequence of actions needs to be performed, this middleware orchestrates the follow up steps.
 * Reason to change: For typical action sequencing, not API call related though (see apiOrchestrationMiddleware for that).
 */

// externals
import { Action, Middleware, Store } from "redux";

// actions
import { setEditMode } from "../actions/appActions";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// state
import { StateTree } from "../reducers/rootReducer";

// consts/enums
import { EditMode } from "../components/common/componentEnums";

export const actionSequencerMiddleware: Middleware<{}, StateTree> = (store) => (next) => (action: Action) => {
    const storeTyped = store as Store<StateTree>;
    next(action);
    switch (action.type) {
        case ActionTypes.RESET_CURRENT_BACKLOG_ITEM: {
            storeTyped.dispatch(setEditMode(EditMode.View));
            break;
        }
    }
};
