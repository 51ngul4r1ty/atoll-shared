/**
 * Purpose: To assist with app initialization and allow it to be reusable- for example, when refreshing the view later.
 * Reason to change: When new routes are added.
 */

// actions
import { apiBffViewsPlan } from "../actions/apiBffViewsPlan";

// selectors
import { selectCurrentRoute } from "../selectors/routerSelectors";

// interfaces/types
import { StateTree } from "../reducers/rootReducer";

// utils
import { mapToRouteTemplate } from "./routeUtils";
import {
    BACKLOGITEM_VIEW_ROUTE,
    DEBUG_PBI_VIEW_ROUTE,
    HOME_VIEW_ROUTE,
    PLAN_VIEW_ROUTE,
    REVIEW_VIEW_ROUTE,
    SPRINT_VIEW_ROUTE
} from "../constants/routes";

export const buildViewInitializationAction = (routePathName: string) => {
    const route = mapToRouteTemplate(routePathName);
    switch (route) {
        case HOME_VIEW_ROUTE: {
            return null;
        }
        case PLAN_VIEW_ROUTE: {
            return apiBffViewsPlan();
        }
        case SPRINT_VIEW_ROUTE: {
            return null;
        }
        case REVIEW_VIEW_ROUTE: {
            return null;
        }
        case DEBUG_PBI_VIEW_ROUTE: {
            return null;
        }
        case BACKLOGITEM_VIEW_ROUTE: {
            return null;
        }
        default: {
            throw new Error(`Unexpected route ${routePathName} - no matching route template`);
        }
    }
};

export const buildCurrentViewInitializationAction = (state: StateTree) => {
    const route = selectCurrentRoute(state);
    const action = buildViewInitializationAction(route);
    return action;
};
