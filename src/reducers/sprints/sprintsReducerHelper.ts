// externals
import { Draft } from "immer";

// components
import {
    SprintDetailFormEditableFieldsWithInstanceId,
    SprintDetailFormEditableFields,
    SprintDetailShowingPicker
} from "../../components/organisms/forms/SprintDetailForm";

// interfaces/types
import { DateOnly } from "../../types";

// consts/enums
import { Source } from "../enums";

// interfaces/types
import type { SprintsState } from "./sprintsReducer";
import type { SaveableSprint, SprintWithSource, EditableSprint, Sprint } from "./sprintsReducerTypes";

export const rebuildAllItems = (draft: Draft<SprintsState>) => {
    const addedItemsWithSource = draft.addedItems.map((draftItem) => {
        const item = draftItem as SaveableSprint;
        const result: SprintWithSource = { ...item, source: Source.Added };
        return result;
    });
    const itemsWithSource = draft.items.map((draftItem) => {
        const item = draftItem as EditableSprint;
        const result: SprintWithSource = { ...item, source: Source.Loaded, saved: true };
        return result;
    });
    const allItemsUnsorted = [...addedItemsWithSource, ...itemsWithSource];
    const allItemsSorted = allItemsUnsorted.sort((a, b) =>
        DateOnly.dateToSimpleValue(a.startDate) < DateOnly.dateToSimpleValue(b.startDate) ? -1 : 1
    );
    draft.allItems = allItemsSorted;
};

export const idsMatch = (item1: SaveableSprint, item2: SprintDetailFormEditableFieldsWithInstanceId): boolean => {
    const instanceIdMatch = !!item1.instanceId && item1.instanceId === item2.instanceId;
    const idMatch = !!item1.id && item1.id === item2.id;
    return instanceIdMatch || idMatch;
};

export const updateSprintFromPayload = (sprint: Sprint, payload: SprintDetailFormEditableFields) => {
    sprint.name = payload.sprintName;
    sprint.startDate = payload.startDate;
    sprint.finishDate = payload.finishDate;
};

export const updateItemFieldsInAllItems = (draft: Draft<SprintsState>, payload: SprintDetailFormEditableFieldsWithInstanceId) => {
    const item = draft.allItems.filter((item) => idsMatch(item as SprintWithSource, payload));
    if (item.length === 1) {
        updateSprintFromPayload(item[0] as SprintWithSource, payload);
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

export const removeSprint = (draft: Draft<SprintsState>, sprintId: string, archived: boolean) => {
    let removedSprint = false;
    const idx = draft.addedItems.findIndex((item) => item.id === sprintId);
    if (idx >= 0) {
        draft.addedItems.splice(idx, 1);
        removedSprint = true;
    }
    const idx2 = draft.items.findIndex((item) => item.id === sprintId);
    if (idx2 >= 0) {
        draft.items.splice(idx2, 1);
        removedSprint = true;
    }
    if (removedSprint) {
        draft.totalSprintCount -= 1;
        if (archived) {
            draft.archivedSprintCount -= 1;
        }
    }
    rebuildAllItems(draft);
    return removedSprint;
};

export const markBacklogItemsLoaded = (draft: Draft<SprintsState>, sprintId: string) => {
    const sprintItems = draft.items.filter((item) => item.id === sprintId);
    sprintItems.forEach((item) => {
        item.backlogItemsLoaded = true;
    });
};

export const updateSprintById = (draft: Draft<SprintsState>, sprintId: string, updateItem: { (item: SaveableSprint) }) => {
    const addedItemIdx = draft.addedItems.findIndex((item) => item.id === sprintId);
    if (addedItemIdx >= 0) {
        updateItem(draft.items[addedItemIdx] as SaveableSprint);
    }
    const idx = draft.items.findIndex((item) => item.id === sprintId);
    if (idx >= 0) {
        updateItem(draft.items[idx] as SaveableSprint);
    }
};

export const updateStateToHideDatePicker = (draft: Draft<SprintsState>) => {
    draft.openedDatePickerInfo = {
        sprintId: null,
        showPicker: SprintDetailShowingPicker.None
    };
};
