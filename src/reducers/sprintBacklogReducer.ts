// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";
import {
    ApiGetSprintBacklogItemsFailureAction,
    ApiGetSprintBacklogItemsSuccessAction,
    ApiSprintBacklogItemSetStatusSuccessAction
} from "../actions/apiSprintBacklog";
import { BacklogItemInSprint } from "../types/backlogItemTypes";
import { BacklogItemInSprintWithSource } from "./backlogItems/backlogItemsReducerTypes";
import {
    AddBacklogItemToSprintAction,
    ChangeSprintPlanningArchivedFilterAction,
    MoveBacklogItemToSprintAction,
    PatchBacklogItemInSprintAction,
    RemoveSprintBacklogItemAction,
    SprintBacklogItemDetailClickAction,
    ToggleSprintBacklogItemDetailAction
} from "../actions/sprintBacklogActions";
import { PushState } from "./types";
import { AppClickAction } from "../actions/appActions";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiBacklogItemInSprint } from "../apiModelTypes";

// utils
import { mapApiItemsToSprintBacklogItems, mapApiStatusToBacklogItem } from "../mappers/backlogItemMappers";
import { calcDropDownMenuState } from "../utils/dropdownMenuUtils";
import { shouldHideDetailMenu } from "../components/utils/itemDetailMenuUtils";
import { mapApiItemsToSprints } from "../mappers";
import { ApiGetSprintFailureAction } from "../actions/apiSprints";
import {
    ITEM_DETAIL_CLICK_STEP_1_NAME,
    ITEM_DETAIL_CLICK_STEP_2_NAME,
    ITEM_DETAIL_CLICK_STEP_3_NAME
} from "../actionFlows/itemDetailMenuActionFlow";

// export type SprintBacklogItem = BacklogItemInSprint;

export interface SprintBacklogSprint {
    items: BacklogItemInSprint[];
}

export type SprintBacklogState = Readonly<{
    includeArchivedSprints: boolean;
    openedDetailMenuBacklogItemId: string | null;
    openingDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintId: string | null;
    openingDetailMenuSprintId: string | null;
    splitInProgress: boolean;
    sprints: { [sprintId: string]: SprintBacklogSprint };
}>;

export const sprintBacklogReducerInitialState = Object.freeze<SprintBacklogState>({
    includeArchivedSprints: false,
    openedDetailMenuBacklogItemId: null,
    openingDetailMenuBacklogItemId: null,
    openedDetailMenuSprintId: null,
    openingDetailMenuSprintId: null,
    splitInProgress: false,
    sprints: {}
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
): BacklogItemInSprintWithSource | null => {
    const sprint = sprintBacklogState.sprints[sprintId];
    if (!sprint) {
        return null;
    }
    const matchingItems = sprint.items.filter((item) => item.id === backlogItemId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem as BacklogItemInSprintWithSource;
    } else {
        return null;
    }
};

export const addSprintBacklogItems = (
    draft: Draft<SprintBacklogState>,
    sprintId: string,
    backlogItems: ApiBacklogItemInSprint[]
) => {
    let sprint = getOrAddSprintById(draft, sprintId);
    sprint.items = [];
    const items = mapApiItemsToSprintBacklogItems(backlogItems);
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
                sprint.items.push(actionTyped.payload.sprintBacklogItem);
                return;
            }
            case ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT: {
                const actionTyped = action as AddBacklogItemToSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                let sprint = getOrAddSprintById(draft, sprintId);
                sprint.items.push(actionTyped.payload.backlogItem);
                return;
            }
            case ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK: {
                const actionTyped = action as SprintBacklogItemDetailClickAction;
                const sprintId = actionTyped.payload.sprintId;
                draft.openingDetailMenuBacklogItemId = calcDropDownMenuState(
                    draft.openingDetailMenuBacklogItemId,
                    actionTyped.payload.backlogItemId,
                    (itemId: string) => getSprintBacklogItemById(state, sprintId, itemId),
                    (item) => item.pushState !== PushState.Removed
                );
                draft.openingDetailMenuSprintId = draft.openingDetailMenuBacklogItemId ? sprintId : null;
                return;
            }
            case ActionTypes.API_GET_SPRINT_FAILURE: {
                const actionTyped = action as ApiGetSprintFailureAction;
                const meta = actionTyped.meta;
                const triggerAction = meta?.passthrough?.triggerAction || null;
                const stepName = meta?.passthrough?.stepName || null;
                if (triggerAction !== ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                    return;
                } else if (stepName === ITEM_DETAIL_CLICK_STEP_1_NAME || stepName === ITEM_DETAIL_CLICK_STEP_2_NAME) {
                    if (draft.openingDetailMenuSprintId === actionTyped.meta.actionParams.sprintId) {
                        draft.openingDetailMenuSprintId = null;
                    }
                } else {
                    throw new Error(`Unable to handle API_GET_SPRINT_FAILURE for "${triggerAction}" step "${stepName}"`);
                }
                return;
            }
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE: {
                const actionTyped = action as ApiGetSprintBacklogItemsFailureAction;
                const meta = actionTyped.meta;
                const triggerAction = meta?.passthrough?.triggerAction;
                const stepName = meta?.passthrough?.stepName || null;
                if (triggerAction === ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                    if (stepName === ITEM_DETAIL_CLICK_STEP_3_NAME) {
                        if (draft.openingDetailMenuSprintId === actionTyped.meta.passthrough.sprintId) {
                            draft.openingDetailMenuSprintId = null;
                        }
                    } else {
                        throw new Error(
                            `Unable to handle API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS for "${triggerAction}" step "${stepName}"`
                        );
                    }
                }
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
                const hasItemDetailMenuOpened = !!draft.openedDetailMenuBacklogItemId;
                if (hasItemDetailMenuOpened) {
                    draft.openingDetailMenuBacklogItemId = null;
                }
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS: {
                draft.openedDetailMenuSprintId = null;
                return;
            }
            case ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiSprintBacklogItemSetStatusSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                const backlogItemPartId = actionTyped.meta.actionParams.backlogItemPartId;

                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    return;
                }
                sprint.items.forEach((item) => {
                    if (item.backlogItemPartId === backlogItemPartId) {
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
            case ActionTypes.PATCH_BACKLOG_ITEM_IN_SPRINT: {
                const actionTyped = action as PatchBacklogItemInSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    throw Error(`Unexpected scenario: sprint ${sprintId} does not exist`);
                } else {
                    const matchingItems = sprint.items.filter((item) => item.id === backlogItemId);
                    if (matchingItems.length === 1) {
                        const backlogItem = matchingItems[0];
                        const patchObj = actionTyped.payload.patchObj;
                        Object.keys(patchObj).forEach((key) => {
                            backlogItem[key] = patchObj[key];
                        });
                    } else {
                        throw Error(
                            `Unexpected scenario: should be a single backlog item matching ${backlogItemId}, ` +
                                `there were ${matchingItems.length}`
                        );
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
            case ActionTypes.API_ADD_SPRINT_BACKLOG_ITEM_PART_REQUEST: {
                draft.splitInProgress = true;
                return;
            }
            // TODO: Add something similar for openingDetailMenuBacklogItemId when API calls fail
            case ActionTypes.API_ADD_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
                draft.splitInProgress = false;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_ADD_SPRINT_BACKLOG_ITEM_PART_FAILURE: {
                draft.splitInProgress = false;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            // TODO: Add something similar for openingDetailMenuBacklogItemId??? Although I think this will be handled when API call
            //   returns either successfully or with a failed state.
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const parent = actionTyped.payload.parent;
                const hideMenu = shouldHideDetailMenu(
                    parent?.dataClass,
                    parent?.itemId,
                    parent?.itemType,
                    draft.openedDetailMenuBacklogItemId
                );
                if (hideMenu) {
                    draft.openedDetailMenuBacklogItemId = null;
                }

                return;
            }
            default:
                return;
        }
    });
