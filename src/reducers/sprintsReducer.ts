// externals
import { Draft, produce } from "immer";

// interfaces/types
import { AnyFSA, StandardModelItem } from "../types";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiSprint } from "../apiModelTypes";
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
import { ApiDeleteSprintSuccessAction, ApiPostSprintSuccessAction } from "../actions/apiSprints";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";
import { calcDropDownMenuState } from "../utils/dropdownMenuUtils";
import { targetIsInMenuButton, targetIsInMenuPanel } from "./backlogItems/backlogItemsReducerHelper";

// components
import {
    SprintDetailFormEditableFields,
    SprintDetailFormEditableFieldsWithInstanceId
} from "../components/organisms/forms/SprintDetailForm";

// actions
import { AppClickAction } from "../actions/appActions";

export interface Sprint extends StandardModelItem {
    name: string;
    startDate: Date;
    finishDate: Date;
    projectId: string;
    plannedPoints: number | null;
    acceptedPoints: number | null;
    velocityPoints: number | null;
    usedSplitPoints: number | null;
    remainingSplitPoints: number | null;
    backlogItemsLoaded: boolean;
    expanded: boolean;
}

export interface EditableSprint extends Sprint {
    editing?: boolean;
}

export interface SaveableSprint extends EditableSprint {
    instanceId?: number | null;
    saved?: boolean;
}

export interface SprintWithSource extends SaveableSprint {
    source: Source;
    pushState?: PushState;
}

export type SprintsState = Readonly<{
    openedDetailMenuSprintId: string | null;
    addedItems: SaveableSprint[];
    allItems: SprintWithSource[];
    items: Sprint[];
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
    openedDetailMenuSprintId: null,
    addedItems: [],
    allItems: [],
    items: []
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

export const mapApiItemToSprint = (apiItem: ApiSprint): Sprint => ({
    id: apiItem.id,
    name: apiItem.name,
    startDate: isoDateStringToDate(apiItem.startdate),
    finishDate: isoDateStringToDate(apiItem.finishdate),
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    projectId: apiItem.projectId,
    plannedPoints: apiItem.plannedPoints,
    acceptedPoints: apiItem.acceptedPoints,
    velocityPoints: apiItem.velocityPoints,
    usedSplitPoints: apiItem.usedSplitPoints,
    remainingSplitPoints: apiItem.remainingSplitPoints,
    backlogItemsLoaded: false,
    expanded: false // TODO: Add smart logic for this
});

export const mapApiItemsToSprints = (apiItems: ApiSprint[]): Sprint[] => {
    return apiItems.map((item) => mapApiItemToSprint(item));
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
                draft.items = mapApiItemsToSprints(payload.response.data.sprints);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                if (!draft.items) {
                    return;
                }
                const sprintItem = draft.items.filter((item) => item.id === sprintId);
                sprintItem.forEach((item) => {
                    item.backlogItemsLoaded = true;
                });
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
                if (draft.openedDetailMenuSprintId) {
                    const actionTyped = action as AppClickAction;
                    const targetElt = actionTyped.payload.target;
                    if (!targetIsInMenuPanel(targetElt) && !targetIsInMenuButton(targetElt)) {
                        draft.openedDetailMenuSprintId = null;
                    }
                }
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_SUCCESS: {
                const actionTyped = action as ApiDeleteSprintSuccessAction;
                const id = actionTyped.meta.originalActionArgs.sprintId;
                removeSprint(draft, id);
                return;
            }
        }
    });
