// externals
import { Draft } from "immer";

// interfaces/types
import { PushBacklogItemModel } from "../../middleware/wsMiddleware";
import { BacklogItemsState, BacklogItemWithSource, EditableBacklogItem, SaveableBacklogItem } from "./backlogItemsReducerTypes";
import { BacklogItem, BacklogItemModel } from "../../types/backlogItemTypes";
import { PushOperationType } from "../../types";
import {
    BacklogItemDetailFormEditableFields,
    BacklogItemDetailFormEditableFieldsWithInstanceId
} from "../../components/organisms/forms/BacklogItemDetailForm";
import { Source, PushState } from "../types";

// utils
import { LinkedList } from "../../utils/linkedList";
import { getParentWithDataClass } from "../../components/common/domUtils";

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
    id: pushedItem.id,
    instanceId: undefined,
    source: Source.Pushed,
    createdAt: pushedItem.createdAt,
    updatedAt: pushedItem.updatedAt,
    estimate: pushedItem.estimate,
    friendlyId: pushedItem.friendlyId,
    externalId: pushedItem.externalId,
    reasonPhrase: pushedItem.reasonPhrase,
    rolePhrase: pushedItem.rolePhrase,
    storyPhrase: pushedItem.storyPhrase,
    type: pushedItem.type,
    projectId: pushedItem.projectId
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

export const rebuildAllItems = (draft: Draft<BacklogItemsState>) => {
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

export const idsMatch = (item1: BacklogItem, item2: BacklogItemDetailFormEditableFieldsWithInstanceId): boolean => {
    const instanceIdMatch = !!item1.instanceId && item1.instanceId === item2.instanceId;
    const idMatch = !!item1.id && item1.id === item2.id;
    return instanceIdMatch || idMatch;
};

export const updateItemFieldsInAllItems = (
    draft: Draft<BacklogItemsState>,
    payload: BacklogItemDetailFormEditableFieldsWithInstanceId
) => {
    const item = draft.allItems.filter((item) => idsMatch(item, payload));
    if (item.length === 1) {
        updateBacklogItemFields(item[0], payload);
    }
};

export const updateBacklogItemFields = (backlogItem: BacklogItem, payload: BacklogItemDetailFormEditableFields) => {
    backlogItem.estimate = payload.estimate;
    backlogItem.friendlyId = payload.friendlyId;
    backlogItem.externalId = payload.externalId;
    backlogItem.storyPhrase = payload.storyPhrase;
    backlogItem.reasonPhrase = payload.reasonPhrase;
    backlogItem.rolePhrase = payload.rolePhrase;
};

export const getBacklogItemById = (backlogItems: BacklogItemsState, itemId: string): BacklogItemWithSource | null => {
    const matchingItems = backlogItems.allItems.filter((item) => item.id === itemId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem as BacklogItemWithSource;
    } else {
        return null;
    }
};

export const updateItemById = (draft: Draft<BacklogItemsState>, itemId: string, updateItem: { (item: EditableBacklogItem) }) => {
    const idx = draft.addedItems.findIndex((item) => item.id === itemId);
    if (idx >= 0) {
        updateItem(draft.addedItems[idx]);
    }
    const idx2 = draft.items.findIndex((item) => item.id === itemId);
    if (idx2 >= 0) {
        updateItem(draft.items[idx2]);
    }
};

export const targetIsInMenuPanel = (target: EventTarget) => {
    return !!getParentWithDataClass(target as HTMLElement, "item-menu-panel");
};

export const targetIsInMenuButton = (target: EventTarget) => {
    return !!getParentWithDataClass(target as HTMLElement, "item-menu-button");
};
