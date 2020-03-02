// middleware
import { API, ApiAction } from "../middleware/apiMiddleware";

// actions
import * as ActionTypes from "./actionTypes";

// consts/enums
import { APPLICATION_JSON } from "../constants";

export const getUserPreferences = (): ApiAction<undefined> => ({
    type: API,
    payload: {
        endpoint: "http://localhost:8500/api/v1/users/{self}/preferences",
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: [
            ActionTypes.API_GET_USER_PREFS_REQUEST,
            ActionTypes.API_GET_USER_PREFS_SUCCESS,
            ActionTypes.API_GET_USER_PREFS_FAILURE
        ]
    }
});