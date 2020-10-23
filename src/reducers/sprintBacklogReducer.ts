// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { ApiGetSprintBacklogItemsSuccessAction } from "../actions/apiSprintBacklog";
import { BacklogItem } from "../types/backlogItemTypes";

// utils
import { mapApiItemsToBacklogItems } from "../mappers/backlogItemMappers";

export type SprintBacklogItem = BacklogItem;

export interface SprintBacklogSprint {
    items: SprintBacklogItem[];
}

export type SprintBacklogState = Readonly<{
    sprints: { [sprintId: string]: SprintBacklogSprint };
}>;

export const sprintBacklogReducerInitialState = Object.freeze<SprintBacklogState>({
    sprints: {}
});

export const sprintBacklogReducer = (
    state: SprintBacklogState = sprintBacklogReducerInitialState,
    action: AnyFSA
): SprintBacklogState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                let sprint = draft.sprints[sprintId];
                if (!sprint) {
                    draft.sprints[sprintId] = { items: [] };
                    sprint = draft.sprints[sprintId];
                } else {
                    sprint.items = [];
                }
                const items = mapApiItemsToBacklogItems(actionTyped.payload.response.data.items);
                items.forEach((item) => {
                    sprint.items.push(item);
                });
                return;
            }
            default:
                return;
        }
    });
