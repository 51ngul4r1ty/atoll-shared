// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { ApiGetSprintBacklogItemsSuccessAction, ApiSprintBacklogItemSetStatusSuccessAction } from "../actions/apiSprintBacklog";
import { BacklogItem } from "../types/backlogItemTypes";
import { BacklogItemWithSource } from "./backlogItems/backlogItemsReducerTypes";
import {
    ChangeSprintPlanningArchivedFilterAction,
    MoveBacklogItemToSprintAction,
    RemoveSprintBacklogItemAction,
    ToggleSprintBacklogItemDetailAction
} from "../actions/sprintBacklogActions";
import { PushState } from "./types";
import { AppClickAction } from "../actions/appActions";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiBacklogItem } from "../apiModelTypes";

// utils
import { mapApiItemsToBacklogItems, mapApiStatusToBacklogItem } from "../mappers/backlogItemMappers";
import { calcDropDownMenuState } from "../utils/dropdownMenuUtils";
import { shouldHideDetailMenu, targetIsInMenuButton, targetIsInMenuPanel } from "../components/utils/itemDetailMenuUtils";
import { mapApiItemsToSprints } from "../mappers";

export type SprintBacklogItem = BacklogItem;

export interface SprintBacklogSprint {
    items: SprintBacklogItem[];
}

export type SprintBacklogState = Readonly<{
    includeArchivedSprints: boolean;
    openedDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintId: string | null;
    sprints: { [sprintId: string]: SprintBacklogSprint };
}>;

export const sprintBacklogReducerInitialState = Object.freeze<SprintBacklogState>({
    includeArchivedSprints: false,
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

export const addSprintBacklogItems = (draft: Draft<SprintBacklogState>, sprintId: string, backlogItems: ApiBacklogItem[]) => {
    let sprint = getOrAddSprintById(draft, sprintId);
    sprint.items = [];
    const items = mapApiItemsToBacklogItems(backlogItems);
    items.forEach((item) => {
        sprint.items.push(item);
    });
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
                addSprintBacklogItems(draft, sprintId, actionTyped.payload.response.data.items);
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
                    actionTyped.payload.backlogItemId,
                    (itemId: string) => getSprintBacklogItemById(state, sprintId, itemId),
                    (item) => item.pushState !== PushState.Removed
                );
                draft.openedDetailMenuSprintId = draft.openedDetailMenuBacklogItemId ? sprintId : null;
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS: {
                draft.openedDetailMenuSprintId = null;
                return;
            }
            case ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiSprintBacklogItemSetStatusSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                const backlogItemId = actionTyped.meta.actionParams.backlogItemId;

                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    return;
                }
                sprint.items.forEach((item) => {
                    if (item.id === backlogItemId) {
                        item.status = mapApiStatusToBacklogItem(actionTyped.meta.requestBody.data.status);
                    }
                });
                draft.openedDetailMenuSprintId = null;
                return;
            }
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
            case ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER: {
                const actionTyped = action as ChangeSprintPlanningArchivedFilterAction;
                if (draft.includeArchivedSprints !== actionTyped.payload.includeArchived) {
                    draft.includeArchivedSprints = actionTyped.payload.includeArchived;
                }
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                const expandedSprints = mapApiItemsToSprints(payload.response.data.sprints).filter((item) => item.expanded);
                if (expandedSprints.length) {
                    const expandedSprint = expandedSprints[0];
                    const sprintId = expandedSprint.id;
                    addSprintBacklogItems(draft, sprintId, payload.response.data.sprintBacklogItems);
                }
                return;
            }
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const targetElt = actionTyped.payload.target;
                const hideMenu = shouldHideDetailMenu(targetElt, draft.openedDetailMenuBacklogItemId);
                if (hideMenu) {
                    draft.openedDetailMenuBacklogItemId = null;
                }

                return;
            }
            default:
                return;
        }
    });
