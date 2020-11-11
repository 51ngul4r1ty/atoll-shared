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
    UpdateSprintFieldsAction
} from "../actions/sprintActions";
import { NewSprintPosition } from "../actions/sprintActions";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

// components
import {
    SprintDetailFormEditableFields,
    SprintDetailFormEditableFieldsWithInstanceId
} from "../components/organisms/forms/SprintDetailForm";

export interface Sprint extends StandardModelItem {
    name: string;
    displayIndex: number;
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
    addedItems: SaveableSprint[];
    allItems: SprintWithSource[];
    items: Sprint[];
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
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
    displayIndex: apiItem.displayindex,
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
        }
    });
