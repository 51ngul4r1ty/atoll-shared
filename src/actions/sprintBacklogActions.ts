// actions
import * as ActionTypes from "./actionTypes";

let lastInstanceId = 0;

export interface AddNewSprintActionPayload {
    sprintId: string;
    instanceId: number;
}

export interface AddBacklogItemsToSprintAction {
    type: typeof ActionTypes.ADD_BACKLOG_ITEMS_TO_SPRINT;
    payload: AddNewSprintActionPayload;
}

// TODO: Consider changing this to indicate that it won't add the item yet, it is just initiating the add process
export const addBacklogItemsToSprint = (sprintId: string): AddBacklogItemsToSprintAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEMS_TO_SPRINT,
    payload: {
        sprintId,
        instanceId: ++lastInstanceId
    }
});
