// middleware
import { API, ApiAction } from "../middleware/apiMiddleware";

// actions
import * as ActionTypes from "./actionTypes";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { BacklogItemType } from "../types";

export const getBacklogItems = (): ApiAction<undefined> => ({
    type: API,
    payload: {
        endpoint: "http://localhost:8500/api/v1/backlog-items",
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: [
            ActionTypes.API_GET_BACKLOG_ITEMS_REQUEST,
            ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS,
            ActionTypes.API_GET_BACKLOG_ITEMS_FAILURE
        ]
    }
});

export const addNewBacklogItem = (type: BacklogItemType) => ({
    type: ActionTypes.ADD_BACKLOGITEM,
    payload: {
        type
    }
});
