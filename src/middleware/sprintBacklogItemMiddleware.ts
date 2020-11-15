// TODO: Add comments at top of this file to explain what its responsibility is.

// externals
import { Action, Store } from "redux";

// selectors
import { getBacklogItemById } from "../selectors/backlogItemSelectors";
import { getFirstSprint, getLastSprint } from "../selectors/sprintSelectors";
import { getCurrentProjectId } from "../selectors/userSelectors";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { ApiPostSprintBacklogItemSuccessAction } from "../actions/apiSprintBacklog";
import { SaveableSprint } from "../reducers/sprintsReducer";

// state
import { StateTree } from "../reducers/rootReducer";

// actions
import { moveBacklogItemToSprint } from "../actions/sprintBacklogActions";
import { AddNewSprintFormAction, addSprint, NewSprintPosition } from "../actions/sprintActions";

// utils
import { addDays } from "../utils/dateHelper";

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
        case ActionTypes.ADD_SPRINT_FORM: {
            const state = storeTyped.getState();
            const actionTyped = action as AddNewSprintFormAction;
            const position = actionTyped.payload.position;
            let startDate: Date;
            let finishDate: Date;
            // TODO: Make this configurable (create a story for this)
            const SPRINT_DAY_LENGTH = 14;
            if (position === NewSprintPosition.Before) {
                const firstSprint = getFirstSprint(state);
                startDate = addDays(firstSprint.startDate, -SPRINT_DAY_LENGTH);
                finishDate = firstSprint.startDate;
            } else if (position === NewSprintPosition.After) {
                const lastSprint = getLastSprint(state);
                startDate = lastSprint.finishDate;
                finishDate = addDays(lastSprint.finishDate, SPRINT_DAY_LENGTH);
            } else {
                throw Error(`Unexpected ${position}`);
            }

            const newItem: SaveableSprint = {
                id: null,
                name: "New Sprint", // TODO: Add story to configure a default formatting rule?
                startDate,
                finishDate,
                instanceId: actionTyped.payload.instanceId,
                projectId: getCurrentProjectId(state),
                plannedPoints: 0,
                acceptedPoints: 0,
                velocityPoints: 0,
                usedSplitPoints: 0,
                remainingSplitPoints: 0,
                backlogItemsLoaded: true,
                expanded: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                saved: false
            };
            storeTyped.dispatch(addSprint(newItem, position));
            return;
        }
    }
};
