// externals
import { Draft, produce } from "immer";

// interfaces/types
import { AnyFSA, StandardModelItem } from "../types";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { PushState, Source } from "./types";
import { ApiGetSprintBacklogItemsSuccessAction } from "../actions/apiSprintBacklog";
import {
    AddSprintAction,
    CancelUnsavedSprintAction,
    CollapseSprintPanelAction,
    ExpandSprintPanelAction,
    ToggleSprintDetailAction,
    UpdateSprintFieldsAction
} from "../actions/sprintActions";
import { NewSprintPosition } from "../actions/sprintActions";
import {
    ApiSetSprintArchiveFlagSuccessAction,
    ApiDeleteSprintSuccessAction,
    ApiGetSprintsSuccessAction,
    ApiPostSprintSuccessAction
} from "../actions/apiSprints";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// utils
import { calcDropDownMenuState } from "../utils/dropdownMenuUtils";
import { mapApiItemsToSprints } from "../mappers/sprintMappers";
import { shouldHideDetailMenu, targetIsInMenuButton, targetIsInMenuPanel } from "../components/utils/itemDetailMenuUtils";

// components
import {
    SprintDetailFormEditableFields,
    SprintDetailFormEditableFieldsWithInstanceId
} from "../components/organisms/forms/SprintDetailForm";

// actions
import { AppClickAction } from "../actions/appActions";
import { UpdateSprintStatsAction } from "../actions/sprintActions";

export interface Sprint extends StandardModelItem {
    acceptedPoints: number | null;
    archived: boolean;
    backlogItemsLoaded: boolean;
    expanded: boolean;
    finishDate: Date;
    name: string;
    plannedPoints: number | null;
    projectId: string;
    remainingSplitPoints: number | null;
    startDate: Date;
    totalPoints: number | null;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}

export interface EditableSprint extends Sprint {
    editing?: boolean;
}

export interface SaveableSprint extends EditableSprint {
    instanceId?: number | null;
    saved?: boolean;
}

export interface SprintWithSource extends SaveableSprint {
    pushState?: PushState;
    source: Source;
}

export type SprintsState = Readonly<{
    addedItems: SaveableSprint[];
    allItems: SprintWithSource[];
    items: Sprint[];
    openedDetailMenuSprintId: string | null;
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
    addedItems: [],
    allItems: [],
    items: [],
    openedDetailMenuSprintId: null
});

export const rebuildAllItems = (draft: Draft<SprintsState>) => {
    const addedItemsWithSource = draft.addedItems.map((item) => {
        const result: SprintWithSource = { ...item, source: Source.Added };
        return result;
    });
    const itemsWithSource = draft.items.map((item) => {
        const result: SprintWithSource = { ...item, source: Source.Loaded, saved: true, editing: false };
        return result;
    });
    const allItemsUnsorted = [...addedItemsWithSource, ...itemsWithSource];
    const allItemsSorted = allItemsUnsorted.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
    draft.allItems = allItemsSorted;
};

export const idsMatch = (item1: SaveableSprint, item2: SprintDetailFormEditableFieldsWithInstanceId): boolean => {
    const instanceIdMatch = !!item1.instanceId && item1.instanceId === item2.instanceId;
    const idMatch = !!item1.id && item1.id === item2.id;
    return instanceIdMatch || idMatch;
};

export const updateSprintFields = (sprint: Sprint, payload: SprintDetailFormEditableFields) => {
    sprint.name = payload.sprintName;
    sprint.startDate = payload.startDate;
    sprint.finishDate = payload.finishDate;
};

export const updateItemFieldsInAllItems = (draft: Draft<SprintsState>, payload: SprintDetailFormEditableFieldsWithInstanceId) => {
    const item = draft.allItems.filter((item) => idsMatch(item, payload));
    if (item.length === 1) {
        updateSprintFields(item[0], payload);
    }
};

export const getSprintById = (sprintsState: SprintsState, sprintId: string): Sprint | null => {
    const sprints = sprintsState.items.filter((sprint) => sprint.id === sprintId);
    if (sprints.length === 1) {
        return sprints[0];
    } else if (sprints.length === 0) {
        return null;
    } else {
        throw new Error(`Unexpected condition - ${sprints.length} sprint items have sprint ID = "${sprintId}"`);
    }
};

export const removeSprint = (draft: Draft<SprintsState>, sprintId: string) => {
    let result = false;
    const idx = draft.addedItems.findIndex((item) => item.id === sprintId);
    if (idx >= 0) {
        draft.addedItems.splice(idx, 1);
        result = true;
    }
    const idx2 = draft.items.findIndex((item) => item.id === sprintId);
    if (idx2 >= 0) {
        draft.items.splice(idx2, 1);
        result = true;
    }
    rebuildAllItems(draft);
    return result;
};

export const markBacklogItemsLoaded = (draft: Draft<SprintsState>, sprintId: string) => {
    const sprintItem = draft.items.filter((item) => item.id === sprintId);
    sprintItem.forEach((item) => {
        item.backlogItemsLoaded = true;
    });
};

export const sprintsReducer = (state: SprintsState = sprintsReducerInitialState, action: AnyFSA): SprintsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.COLLAPSE_SPRINT_PANEL: {
                const actionTyped = action as CollapseSprintPanelAction;
                draft.items.forEach((item) => {
                    if (item.id === actionTyped.payload.sprintId) {
                        item.expanded = false;
                    }
                    item.id;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.EXPAND_SPRINT_PANEL: {
                const actionTyped = action as ExpandSprintPanelAction;
                draft.items.forEach((item) => {
                    if (item.id === actionTyped.payload.sprintId) {
                        item.expanded = true;
                    }
                    item.id;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                const sprints = mapApiItemsToSprints(payload.response.data.sprints);
                draft.items = sprints;
                const expandedSprints = sprints.filter((item) => item.expanded);
                if (expandedSprints.length) {
                    const expandedSprint = expandedSprints[0];
                    const sprintId = expandedSprint.id;
                    markBacklogItemsLoaded(draft, sprintId);
                }
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_SPRINTS_SUCCESS: {
                const actionTyped = action as ApiGetSprintsSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToSprints(payload.response.data.items);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                if (!draft.items) {
                    return;
                }
                markBacklogItemsLoaded(draft, sprintId);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.ADD_SPRINT: {
                const actionTyped = action as AddSprintAction;
                const position = actionTyped.payload.position;
                const newItem = actionTyped.payload.sprint;
                if (position === NewSprintPosition.Before) {
                    draft.addedItems = [newItem, ...draft.addedItems];
                } else if (position === NewSprintPosition.After) {
                    draft.addedItems = [...draft.addedItems, newItem];
                } else {
                    throw Error(`Unexpected ${position}`);
                }
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_UNSAVED_SPRINT: {
                const actionTyped = action as CancelUnsavedSprintAction;
                const newItems = [];
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId !== actionTyped.payload.instanceId) {
                        newItems.push(addedItem);
                    }
                });
                draft.addedItems = newItems;
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_EDIT_SPRINT: {
                // TODO: Implement
                // const actionTyped = action as CancelEditSprintAction;
                // updateItemById(draft, actionTyped.payload.itemId, (item) => {
                //     item.editing = false;
                // });
                // rebuildAllItems(draft);
                return;
            }
            case ActionTypes.UPDATE_SPRINT_FIELDS: {
                const actionTyped = action as UpdateSprintFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (idsMatch(addedItem, actionTyped.payload)) {
                        updateSprintFields(addedItem, actionTyped.payload);
                    }
                });
                draft.items.forEach((item) => {
                    if (idsMatch(item, actionTyped.payload)) {
                        updateSprintFields(item, actionTyped.payload);
                    }
                });
                updateItemFieldsInAllItems(draft, actionTyped.payload);
                return;
            }
            case ActionTypes.API_POST_SPRINT_SUCCESS: {
                const actionTyped = action as ApiPostSprintSuccessAction;
                const { payload, meta } = actionTyped;
                const updatedSprint = payload.response.data.item;
                const instanceId = meta.instanceId;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === instanceId) {
                        addedItem.id = updatedSprint.id;
                        addedItem.saved = true;
                    }
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL: {
                const actionTyped = action as ToggleSprintDetailAction;
                const sprintId = actionTyped.payload.sprintId;
                draft.openedDetailMenuSprintId = calcDropDownMenuState(draft.openedDetailMenuSprintId, sprintId);
                return;
            }
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const targetElt = actionTyped.payload.target;
                const hideMenu = shouldHideDetailMenu(targetElt, draft.openedDetailMenuSprintId);
                if (hideMenu) {
                    draft.openedDetailMenuSprintId = null;
                }
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_SUCCESS: {
                const actionTyped = action as ApiDeleteSprintSuccessAction;
                const id = actionTyped.meta.originalActionArgs.sprintId;
                removeSprint(draft, id);
                return;
            }
            case ActionTypes.API_SET_SPRINT_ARCHIVE_FLAG_SUCCESS: {
                const actionTyped = action as ApiSetSprintArchiveFlagSuccessAction;
                const meta = actionTyped.meta;
                const id = meta.originalActionArgs.sprintId;
                draft.items.forEach((item) => {
                    if (item.id === id) {
                        item.archived = meta.originalActionArgs.archived;
                    }
                });
                rebuildAllItems(draft);
                draft.openedDetailMenuSprintId = null;
                return;
            }
            case ActionTypes.UPDATE_SPRINT_STATS: {
                const actionTyped = action as UpdateSprintStatsAction;
                const sprintId = actionTyped.payload.sprintId;
                const newSprintStats = actionTyped.payload.sprintStats;
                let changed = false;
                draft.items.forEach((item) => {
                    if (item.id === sprintId) {
                        if (item.plannedPoints !== newSprintStats.plannedPoints) {
                            item.plannedPoints = newSprintStats.plannedPoints;
                            changed = true;
                        }
                        if (item.acceptedPoints !== newSprintStats.acceptedPoints) {
                            item.acceptedPoints = newSprintStats.acceptedPoints;
                            changed = true;
                        }
                        if (item.totalPoints !== newSprintStats.totalPoints) {
                            item.totalPoints = newSprintStats.totalPoints;
                            changed = true;
                        }
                    }
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
                return;
            }
        }
    });
