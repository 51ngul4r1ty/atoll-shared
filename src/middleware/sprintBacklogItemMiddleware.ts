// externals
import { Action, Store } from "redux";

// selectors
import { getBacklogItemById } from "../selectors/backlogItemSelectors";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { ApiPostSprintBacklogItemSuccessAction } from "../actions/apiSprintBacklog";

// state
import { StateTree } from "../reducers/rootReducer";
import { moveBacklogItemToSprint } from "../actions/sprintBacklogActions";

export const sprintBacklogItemMiddleware = (store) => (next) => (action: Action) => {
    next(action);
    const storeTyped = store as Store<StateTree>;
    switch (action.type) {
        case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS: {
            const state = storeTyped.getState();
            const actionTyped = action as ApiPostSprintBacklogItemSuccessAction;
            const sprintId = actionTyped.payload.response?.data?.item?.sprintId;
            if (!sprintId) {
                throw Error("Invalid response from server - sprintId should be returned when adding sprint backlog item");
            }
            const backlogItemId = actionTyped.payload.response?.data?.item?.backlogitemId;
            if (!backlogItemId) {
                throw Error("Invalid response from server - backlogItemId should be returned when adding sprint backlog item");
            }
            const backlogItem = getBacklogItemById(state, backlogItemId);
            if (!backlogItem) {
                throw new Error(`Unable to find backlog item with ID ${backlogItemId}`);
            }
            storeTyped.dispatch(moveBacklogItemToSprint(sprintId, backlogItem));
            return;
        }
    }
};
