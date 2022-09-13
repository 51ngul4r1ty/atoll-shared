/**
 * Purpose: Orchestrate app-wide related behavior.
 * Reason to change: When new app-wide behavior is needed.
 */

// externals
import type { Action, Middleware } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { StateTree } from "../reducers/rootReducer";

// interfaces/types
import type { StoreTyped } from "../types/reduxHelperTypes";
import { buildCurrentViewInitializationAction } from "../utils/initializer";

export const appMiddleware: Middleware<{}, StateTree> = (store: StoreTyped) => (next) => (action: Action) => {
    next(action);
    switch (action.type) {
        case ActionTypes.APP_REFRESH_VIEW: {
            const state = store.getState();
            const action = buildCurrentViewInitializationAction(state);
            store.dispatch(action);
            break;
        }
    }
};
