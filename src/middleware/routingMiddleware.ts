// externals
import type { Action } from "redux";
import { push } from "connected-react-router";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

export const routingMiddleware = ({ dispatch }) => (next) => (action: Action) => {
    next(action);
    switch (action.type) {
        case ActionTypes.ROUTE_PLAN_VIEW:
            dispatch(push("/plan"));
            break;
        case ActionTypes.ROUTE_SPRINT_VIEW:
            dispatch(push("/sprint"));
            break;
        case ActionTypes.ROUTE_REVIEW_VIEW:
            dispatch(push("/review"));
            break;
    }
};
