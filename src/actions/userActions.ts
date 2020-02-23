// middleware
import { API, ApiAction } from "../middleware/apiMiddleware";
import * as ActionTypes from "./actionTypes";

export const getUserPreferences = (): ApiAction<undefined> => ({
    type: API,
    payload: {
        endpoint: "http://localhost:8500/api/v1/users/{self}/preferences",
        method: "GET",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        types: [
            ActionTypes.API_GET_BACKLOG_ITEMS_REQUEST,
            ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS,
            ActionTypes.API_GET_BACKLOG_ITEMS_FAILURE
        ]
    }
});
