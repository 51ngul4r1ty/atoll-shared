// actions
import * as ActionTypes from "./actionTypes";

let lastInstanceId = 0;

export interface AddNewSprintActionPayload {
    sprintId: string;
    instanceId: number;
}

export interface AddBacklogItemToSprint {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT;
    payload: AddNewSprintActionPayload;
}

// TODO: Consider changing this to indicate that it won't add the item yet, it is just initiating the add process
export const addBacklogItemToSprint = (sprintId: string): AddBacklogItemToSprint => ({
    type: ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT,
    payload: {
        sprintId,
        instanceId: ++lastInstanceId
    }
});
