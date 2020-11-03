// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { ApiGetSprintBacklogItemsSuccessAction } from "../actions/apiSprintBacklog";
import { BacklogItem } from "../types/backlogItemTypes";

// utils
import { mapApiItemsToBacklogItems } from "../mappers/backlogItemMappers";
import {
    MoveBacklogItemToSprintAction,
    RemoveSprintBacklogItemAction,
    ToggleSprintBacklogItemDetailAction
} from "../actions/sprintBacklogActions";
import { calcDropDownMenuState } from "../utils/dropdownMenuUtils";
import { BacklogItemWithSource } from "./backlogItems/backlogItemsReducerTypes";

export type SprintBacklogItem = BacklogItem;

export interface SprintBacklogSprint {
    items: SprintBacklogItem[];
}

export type SprintBacklogState = Readonly<{
    sprints: { [sprintId: string]: SprintBacklogSprint };
    openedDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintId: string | null;
}>;

export const sprintBacklogReducerInitialState = Object.freeze<SprintBacklogState>({
    sprints: {},
    openedDetailMenuBacklogItemId: null,
    openedDetailMenuSprintId: null
});

export const getOrAddSprintById = (draft: Draft<SprintBacklogState>, sprintId: string) => {
    let sprint = draft.sprints[sprintId];
    if (!sprint) {
        draft.sprints[sprintId] = { items: [] };
        sprint = draft.sprints[sprintId];
    }
    return sprint;
};

export const getSprintBacklogItemById = (
    sprintBacklogState: SprintBacklogState,
    sprintId: string,
    backlogItemId: string
): BacklogItemWithSource | null => {
    const sprint = sprintBacklogState.sprints[sprintId];
    if (!sprint) {
        return null;
    }
    const matchingItems = sprint.items.filter((item) => item.id === backlogItemId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem as BacklogItemWithSource;
    } else {
        return null;
    }
};

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
                let sprint = getOrAddSprintById(draft, sprintId);
                sprint.items = [];
                const items = mapApiItemsToBacklogItems(actionTyped.payload.response.data.items);
                items.forEach((item) => {
                    sprint.items.push(item);
                });
                return;
            }
            case ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT: {
                const actionTyped = action as MoveBacklogItemToSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                let sprint = getOrAddSprintById(draft, sprintId);
                sprint.items.push(actionTyped.payload.backlogItem);
                return;
            }
            case ActionTypes.TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as ToggleSprintBacklogItemDetailAction;
                const sprintId = actionTyped.payload.sprintId;
                draft.openedDetailMenuBacklogItemId = calcDropDownMenuState(
                    draft.openedDetailMenuBacklogItemId,
                    actionTyped.payload.itemId,
                    (itemId: string) => getSprintBacklogItemById(state, sprintId, itemId)
                );
                draft.openedDetailMenuSprintId = draft.openedDetailMenuBacklogItemId ? sprintId : null;
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS:
                draft.openedDetailMenuSprintId = null;
                return;
            case ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM: {
                const actionTyped = action as RemoveSprintBacklogItemAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    throw Error(`Unexpected scenario: sprint ${sprintId} does not exist`);
                } else {
                    let idx = -1;
                    let foundIdx = -1;
                    sprint.items.forEach((item) => {
                        idx++;
                        if (item.id === backlogItemId) {
                            foundIdx = idx;
                        }
                    });
                    if (foundIdx >= 0) {
                        sprint.items.splice(foundIdx, 1);
                    } else {
                        throw Error(`Unexpected scenario: backlog item ${backlogItemId} does not exist`);
                    }
                }

                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_FAILURE: {
                // TODO: Handle failure - it may not be here though, probably needs to be at app level for message?
                return;
            }
            default:
                return;
        }
    });
