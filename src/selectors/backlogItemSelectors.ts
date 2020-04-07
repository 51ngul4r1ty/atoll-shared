// interfaces/types
import { BacklogItem } from "../reducers/backlogItemsReducer";
import { StateTree } from "../types";

export const getBacklogItemByInstanceId = (state: StateTree, instanceId: number): BacklogItem | null => {
    const matchingItems = state.backlogItems.addedItems.filter((addedItem) => addedItem.instanceId === instanceId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem;
    } else {
        return null;
    }
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
    return prevItem;
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
