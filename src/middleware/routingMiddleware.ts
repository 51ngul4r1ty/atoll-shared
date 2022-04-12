// externals
import type { Action, Dispatch, MiddlewareAPI } from "redux";
import { push } from "connected-react-router";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import type { StateTree } from "../reducers/rootReducer";
import type { RouteToAction } from "../actions/routeActions";

// actions
import { storePostLoginReturnRoute } from "../actions/appActions";

export const routingMiddleware = (store: MiddlewareAPI<Dispatch, StateTree>) => (next) => (action: Action) => {
    next(action);
    const state = store.getState();
    switch (action.type) {
        case ActionTypes.ROUTE_PLAN_VIEW: {
            store.dispatch(push("/plan"));
            break;
        }
        case ActionTypes.ROUTE_SPRINT_VIEW: {
            store.dispatch(push("/sprint"));
            break;
        }
        case ActionTypes.ROUTE_REVIEW_VIEW: {
            store.dispatch(push("/review"));
            break;
        }
        case ActionTypes.ROUTE_LOGIN_PAGE: {
            const currentRoute = state.router?.location?.pathname || "/";
            if (currentRoute !== "/") {
                store.dispatch(storePostLoginReturnRoute(currentRoute));
            }
            store.dispatch(push("/"));
            break;
        }
        case ActionTypes.ROUTE_TO: {
            const actionTyped = action as RouteToAction;
            store.dispatch(push(actionTyped.payload));
            break;
        }
    }
};
