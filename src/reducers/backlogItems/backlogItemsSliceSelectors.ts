// interfaces/types
import type { BacklogItemsState, BacklogItemWithSource } from "./backlogItemsReducerTypes";

export const sliceSelectBacklogItemById = (backlogItems: BacklogItemsState, itemId: string): BacklogItemWithSource | null => {
    const matchingItems = backlogItems.allItems.filter((item) => item.id === itemId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem as BacklogItemWithSource;
    } else {
        return null;
    }
};

export const sliceSelectSelectedBacklogItemIds = (backlogItems: BacklogItemsState) => backlogItems.selectedItemIds;
