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
