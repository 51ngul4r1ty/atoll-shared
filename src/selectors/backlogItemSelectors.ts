// interfaces/types
import type { BacklogItem, BacklogItemPart, BacklogItemType } from "../types/backlogItemTypes";
import type { BacklogItemsState } from "../reducers/backlogItems/backlogItemsReducerTypes";
import type { StateTree } from "../reducers/rootReducer";

// consts/enums
import { BacklogItemStatus } from "../types/backlogItemEnums";

// utils
import { getBacklogItemById as reducerGetBacklogItemById } from "../reducers/backlogItems/backlogItemsReducerHelper";
import { createSelector } from "reselect";
import { isoDateStringToDate } from "../utils/apiPayloadConverters";
import { mapApiStatusToBacklogItem } from "../mappers/backlogItemMappers";

export const getBacklogItemByInstanceId = (state: StateTree, instanceId: number): BacklogItem | null => {
    const matchingItems = state.backlogItems.addedItems.filter((addedItem) => addedItem.instanceId === instanceId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem;
    } else {
        return null;
    }
};

export const getBacklogItemById = (state: StateTree, itemId: string): BacklogItem | null => {
    return reducerGetBacklogItemById(state.backlogItems, itemId);
};

export const getCurrentBacklogItem = (state: StateTree): BacklogItem | null => {
    return state.backlogItems.currentItem;
};

export const getPrevSavedBacklogItemByInstanceId = (state: StateTree, instanceId: number): BacklogItem | null => {
    let prevItem = null;
    let foundPrevItem = null;
    state.backlogItems.addedItems.forEach((addedItem) => {
        if (addedItem.instanceId === instanceId) {
            foundPrevItem = prevItem;
            return;
        }
        if (addedItem.saved) {
            prevItem = addedItem;
        }
    });
    return foundPrevItem;
};

interface PrevNextAndCurrentBacklogItem {
    prev: BacklogItem | null;
    curr: BacklogItem | null;
    next: BacklogItem | null;
}

export const getPrevNextAndCurrentById = (state: StateTree, id: string): PrevNextAndCurrentBacklogItem => {
    const addedSavedItems = state.backlogItems.addedItems.filter((item) => item.saved);
    const addedItems = addedSavedItems.map((item) => ({
        ...item,
        addedItem: true
    }));
    const items = state.backlogItems.items.map((item) => ({
        ...item,
        addedItem: false
    }));
    const allItems = addedItems.concat(items);
    let resultPrevItem: BacklogItem | null = null;
    let resultCurrItem: BacklogItem | null = null;
    let resultNextItem: BacklogItem | null = null;
    let previousItem: BacklogItem | null = null;
    allItems.some((item) => {
        let exitLoop = false;
        if (resultCurrItem) {
            resultNextItem = item;
            exitLoop = true;
        } else if (item.id === id) {
            resultCurrItem = item;
            resultPrevItem = previousItem;
        }
        if (item.saved) {
            previousItem = item;
        }
        return exitLoop;
    });
    return {
        prev: resultPrevItem,
        curr: resultCurrItem,
        next: resultNextItem
    };
};

export const getAllBacklogItems = (state: StateTree) => state.backlogItems.allItems;

export const getSelectedBacklogItemIds = (state: StateTree): string[] => {
    return state.backlogItems.selectedItemIds;
};

export const getSelectedBacklogItems = (state: StateTree) => {
    const results = [];
    const allItemsIndexed: { [itemId: string]: BacklogItem } = {};
    state.backlogItems.allItems.forEach((item) => {
        allItemsIndexed[item.id] = item;
    });
    state.backlogItems.selectedItemIds.forEach((selectedItemId) => {
        results.push(allItemsIndexed[selectedItemId]);
    });
    return results;
};

export const getSelectedBacklogItemCount = (state: StateTree) => {
    return state.backlogItems.selectedItemIds.length;
};

export const getOpenedDetailMenuBacklogItemId = (state: StateTree) => state.backlogItems.openedDetailMenuBacklogItemId;

export const hasPushedBacklogItems = (state: StateTree) => state.backlogItems.pushedItems.length > 0;

export const backlogItems = (state: { backlogItems: BacklogItemsState }): BacklogItemsState => state.backlogItems;

// TODO: Refactor this out to make it obvious that it gets the "backlog item part" instead of "backlog item"
// TODO: Probably need to refactor this whole file in the same way
export const getCurrentBacklogItemId = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.id
);

export type BacklogItemPartForSplitForm = BacklogItemPart & {
    /* from BacklogItemPart */
    id: string | null;
    externalId: string | null;
    backlogItemId: string | null;
    partIndex: number;
    percentage: number;
    points: number | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    status: BacklogItemStatus | null;

    /* new in this type */
    allocatedSprintId: string | null;
    allocatedSprintName: string | null;
    editable: boolean;
    expanded: boolean;
};

export const getCurrentBacklogItemParts = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): BacklogItemPartForSplitForm[] => {
        return backlogItems.currentItemPartsAndSprints.map((partAndSprint) => {
            const part: BacklogItemPartForSplitForm = {
                allocatedSprintId: partAndSprint.sprint?.id || null,
                allocatedSprintName: partAndSprint.sprint?.name || null,
                editable: false,
                expanded: true,
                id: partAndSprint.part.id,
                externalId: partAndSprint.part.externalId,
                backlogItemId: partAndSprint.part.backlogitemId,
                partIndex: partAndSprint.part.partIndex,
                percentage: partAndSprint.part.percentage,
                points: partAndSprint.part.points,
                startedAt: isoDateStringToDate(partAndSprint.part.startedAt),
                status: mapApiStatusToBacklogItem(partAndSprint.part.status),
                finishedAt: isoDateStringToDate(partAndSprint.part.finishedAt)
            };
            return part;
        });
    }
);

export const getCurrentBacklogItemFriendlyId = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.friendlyId
);

export const getCurrentBacklogItemExternalId = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.externalId
);

export const getCurrentBacklogItemSaved = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): boolean => backlogItems.currentItem?.saved
);

export const getCurrentBacklogItemEstimate = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): number => backlogItems.currentItem?.estimate
);

export const getCurrentBacklogItemRolePhrase = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.rolePhrase
);

export const getCurrentBacklogItemStoryPhrase = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.storyPhrase
);

export const getCurrentBacklogItemReasonPhrase = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.reasonPhrase
);

export const getCurrentBacklogItemType = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): BacklogItemType => backlogItems.currentItem?.type
);

export const getCurrentBacklogItemAcceptanceCriteria = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): string => backlogItems.currentItem?.acceptanceCriteria
);

export const getCurrentBacklogItemStartedAt = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): Date | null => backlogItems.currentItem?.startedAt
);

export const getCurrentBacklogItemFinishedAt = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): Date | null => backlogItems.currentItem?.finishedAt
);

export const getCurrentBacklogItemAcceptedAt = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): Date | null => backlogItems.currentItem?.acceptedAt
);

export const getCurrentBacklogItemReleasedAt = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): Date | null => backlogItems.currentItem?.releasedAt
);
