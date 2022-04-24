// externals
import { Draft } from "immer";

// consts/enums
import { PushOperationType } from "../../types/pushEnums";
import { Source, PushState } from "../enums";

// interfaces/types
import type { PushBacklogItemModel } from "../../middleware/wsMiddleware";
import type {
    BacklogItemPartAndSprintWithUiState,
    BacklogItemsState,
    BacklogItemWithSource,
    EditableBacklogItem,
    SaveableBacklogItem
} from "./backlogItemsReducerTypes";
import type { BacklogItem, BacklogItemModel } from "../../types/backlogItemTypes";
import type {
    BacklogItemEditableFields,
    BacklogItemInstanceEditableFields
} from "../../components/organisms/forms/backlogItemFormTypes";
import type { BacklogItemPart } from "../../types/backlogItemPartTypes";

// utils
import { LinkedList } from "../../utils/linkedList";

export const convertSaved = (saved: boolean | undefined): boolean => {
    if (saved === true) {
        return true;
    } else if (saved === false) {
        return false;
    } else {
        // default to saved if it isn't provided
        return true;
    }
};

export const addSource = (item: SaveableBacklogItem, source: Source) => ({
    ...item,
    source,
    saved: convertSaved(item.saved)
});

export const addSourceToPushedItem = (item: Partial<PushBacklogItemModel>, source: Source) => ({
    ...item,
    source,
    saved: convertSaved(undefined)
});

export const mapPushedToBacklogItem = (pushedItem: Partial<PushBacklogItemModel>): BacklogItemWithSource => ({
    acceptanceCriteria: pushedItem.acceptanceCriteria,
    acceptedAt: pushedItem.acceptedAt,
    createdAt: pushedItem.createdAt,
    estimate: pushedItem.estimate,
    externalId: pushedItem.externalId,
    finishedAt: pushedItem.finishedAt,
    friendlyId: pushedItem.friendlyId,
    id: pushedItem.id,
    instanceId: undefined,
    partIndex: pushedItem.partIndex,
    projectId: pushedItem.projectId,
    reasonPhrase: pushedItem.reasonPhrase,
    releasedAt: pushedItem.releasedAt,
    rolePhrase: pushedItem.rolePhrase,
    source: Source.Pushed,
    startedAt: pushedItem.startedAt,
    status: pushedItem.status,
    storyEstimate: pushedItem.storyEstimate,
    storyPhrase: pushedItem.storyPhrase,
    totalParts: pushedItem.totalParts,
    type: pushedItem.type,
    unallocatedParts: pushedItem.unallocatedParts,
    unallocatedPoints: pushedItem.unallocatedPoints,
    updatedAt: pushedItem.updatedAt,
    saving: false
});

export const addPushedAddedItemsToAllItems = (draft: Draft<BacklogItemsState>, allItems: LinkedList<BacklogItemWithSource>) => {
    const pushedAddedItems = draft.pushedItems.filter((item) => item.operation === PushOperationType.Added);
    const pushedItems = pushedAddedItems.map((item) => addSourceToPushedItem(item.item, Source.Pushed));
    pushedItems.forEach((pushedItem) => {
        const itemData = mapPushedToBacklogItem(pushedItem);
        // TODO: Consider turning on the strict options below for debug mode - so that we catch issues during dev
        //       but prevent the app from blowing up for this non-critical function in prod
        if (pushedItem.prevBacklogItemId) {
            allItems.addItemAfter(pushedItem.id, pushedItem.prevBacklogItemId, itemData, {
                throwErrorForDups: false,
                requireItemIdExistance: false
            });
        } else {
            allItems.addItemBefore(pushedItem.id, pushedItem.nextBacklogItemId, itemData, {
                throwErrorForDups: false,
                requireItemIdExistance: false
            });
        }
    });
};

export const addPushedRemovedItemsToAllItemsArray = (draft: Draft<BacklogItemsState>, allItems: BacklogItemWithSource[]) => {
    const pushedRemovedItems = draft.pushedItems.filter((item) => item.operation === PushOperationType.Removed);
    const pushedRemovedItemsById = {} as { [key: string]: BacklogItemModel };
    pushedRemovedItems.forEach((data) => {
        const item = data.item as BacklogItemModel;
        pushedRemovedItemsById[item.id] = item;
    });

    allItems.forEach((item) => {
        if (pushedRemovedItemsById[item.id]) {
            item.pushState = PushState.Removed;
        }
    });
};

export const addPushedUpdatedItemsToAllItemsArray = (draft: Draft<BacklogItemsState>, allItems: BacklogItemWithSource[]) => {
    const pushedUpdatedItems = draft.pushedItems.filter((item) => item.operation === PushOperationType.Updated);
    const pushedUpdatedItemsById = {} as { [key: string]: BacklogItemModel };
    pushedUpdatedItems.forEach((data) => {
        const item = data.item as BacklogItemModel;
        pushedUpdatedItemsById[item.id] = item;
    });

    allItems.forEach((item) => {
        if (pushedUpdatedItemsById[item.id]) {
            item.pushState = PushState.Changed;
        }
    });
};

export const rebuildAllItems = (draft: Draft<BacklogItemsState>): void => {
    const allItems = new LinkedList<BacklogItemWithSource>();

    const addedItems = draft.addedItems.map((item) => addSource(item, Source.Added));
    allItems.addArray2("id", "instanceId", addedItems);

    const loadedItems = draft.items.map((item) => addSource(item, Source.Loaded));
    allItems.addArray("id", loadedItems);

    addPushedAddedItemsToAllItems(draft, allItems);

    const allItemsArray = allItems.toArray();

    addPushedUpdatedItemsToAllItemsArray(draft, allItemsArray);
    addPushedRemovedItemsToAllItemsArray(draft, allItemsArray);

    draft.allItems = allItemsArray;
};

export const idsMatch = (item1: BacklogItem, item2: BacklogItemEditableFields): boolean => {
    const item2withInstanceId = item2 as BacklogItemInstanceEditableFields;
    const instanceIdMatch = !!item1.instanceId && item1.instanceId === item2withInstanceId.instanceId;
    const idMatch = !!item1.id && item1.id === item2withInstanceId.id;
    return instanceIdMatch || idMatch;
};

export const updateItemFieldsInAllItems = (draft: Draft<BacklogItemsState>, backlogItem: BacklogItemEditableFields) => {
    const item = draft.allItems.filter((item) => idsMatch(item, backlogItem));
    if (item.length === 1) {
        updateBacklogItemFields(item[0], backlogItem);
    }
};

export const updateBacklogItemFields = (backlogItem: BacklogItem, payload: BacklogItemEditableFields) => {
    backlogItem.acceptanceCriteria = payload.acceptanceCriteria;
    backlogItem.estimate = payload.estimate;
    backlogItem.externalId = payload.externalId;
    backlogItem.friendlyId = payload.friendlyId;
    backlogItem.reasonPhrase = payload.reasonPhrase;
    backlogItem.rolePhrase = payload.rolePhrase;
    backlogItem.storyPhrase = payload.storyPhrase;
    backlogItem.startedAt = payload.startedAt;
    backlogItem.finishedAt = payload.finishedAt;
    backlogItem.acceptedAt = payload.acceptedAt;
    backlogItem.releasedAt = payload.releasedAt;
};

export const updateItemByInstanceId = (
    draft: Draft<BacklogItemsState>,
    instanceId: number,
    updateItem: { (addedItem: SaveableBacklogItem) }
): boolean => {
    let changed = false;
    const idx = draft.addedItems.findIndex((item) => item.instanceId === instanceId);
    if (idx >= 0) {
        const item = draft.addedItems[idx];
        const itemBefore = JSON.stringify(item);
        updateItem(item);
        const itemAfter = JSON.stringify(item);
        if (itemAfter !== itemBefore) {
            changed = true;
        }
    }
    return changed;
};

export const updateItemById = (
    draft: Draft<BacklogItemsState>,
    itemId: string,
    updateItem: { (item: EditableBacklogItem) }
): boolean => {
    let changed = false;
    const idx = draft.addedItems.findIndex((item) => item.id === itemId);
    if (idx >= 0) {
        const item = draft.addedItems[idx];
        const itemBefore = JSON.stringify(item);
        updateItem(item);
        const itemAfter = JSON.stringify(item);
        if (itemAfter !== itemBefore) {
            changed = true;
        }
    }
    const idx2 = draft.items.findIndex((item) => item.id === itemId);
    if (idx2 >= 0) {
        const item = draft.items[idx2];
        const itemBefore = JSON.stringify(item);
        updateItem(item);
        const itemAfter = JSON.stringify(item);
        if (itemAfter !== itemBefore) {
            changed = true;
        }
    }
    return changed;
};

export const getBacklogItemPartById = (backlogItems: BacklogItemsState, itemId: string): BacklogItemPart | null => {
    const partAndSprint = backlogItems.currentItemPartsAndSprints.find((item) => item.part.id === itemId);
    if (!partAndSprint) {
        return null;
    }
    return partAndSprint.part;
};

export const updateCurrentItemPartById = (
    draft: Draft<BacklogItemsState>,
    itemId: string,
    updateItem: { (item: BacklogItemPartAndSprintWithUiState) }
): void => {
    const idx = draft.currentItemPartsAndSprints.findIndex((item) => item.part.id === itemId);
    if (idx >= 0) {
        updateItem(draft.currentItemPartsAndSprints[idx] as BacklogItemPartAndSprintWithUiState);
    }
};

export const updateBacklogItemFieldsInItemsAndAddedItems = (
    draft: Draft<BacklogItemsState>,
    payload: BacklogItemInstanceEditableFields
): void => {
    draft.addedItems.forEach((addedItem) => {
        if (idsMatch(addedItem, payload)) {
            updateBacklogItemFields(addedItem, payload);
        }
    });
    draft.items.forEach((addedItem) => {
        if (idsMatch(addedItem, payload)) {
            updateBacklogItemFields(addedItem, payload);
        }
    });
    updateItemFieldsInAllItems(draft, payload);
};

export const turnOffEditModeForBacklogItemPart = (draft: Draft<BacklogItemsState>, id: string): void => {
    updateCurrentItemPartById(draft, id, (item) => {
        item.state.editable = false;
    });
    draft.openedDetailMenuBacklogItemPartId = null;
};
