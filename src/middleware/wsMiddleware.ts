// externals
import { Action } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { ApiPostBacklogItemSuccessAction, ApiPostBacklogItemSuccessResponseItem } from "../actions/backlogItems";

// TODO: May be best to move this out of here
const pushBacklogItemSaved = (item: ApiPostBacklogItemSuccessResponseItem) => {
    console.log("SEND MESSAGE TO SERVER");
};

export const wsMiddleware = ({ dispatch }) => (next) => (action: Action) => {
    next(action);
    switch (action.type) {
        case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiPostBacklogItemSuccessAction;
            if (actionTyped.payload.response?.status === 201) {
                const item = actionTyped.payload.response.data?.item;
                pushBacklogItemSaved(item);
            }
            break;
        }
    }
};
