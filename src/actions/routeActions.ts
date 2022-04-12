// interfaces/types
import type { FSA } from "../types/reactHelperTypes";

// consts/enums
import * as ActionTypes from "./actionTypes";

export const routePlanView = () => ({
    type: ActionTypes.ROUTE_PLAN_VIEW
});

export const routeSprintView = () => ({
    type: ActionTypes.ROUTE_SPRINT_VIEW
});

export const routeReviewView = () => ({
    type: ActionTypes.ROUTE_REVIEW_VIEW
});

export const routeLoginPage = () => ({
    type: ActionTypes.ROUTE_LOGIN_PAGE
});

export type RouteToAction = FSA<typeof ActionTypes.ROUTE_TO, string>;
export const routeTo = (newRoute: string): RouteToAction => ({
    type: ActionTypes.ROUTE_TO,
    payload: newRoute
});
