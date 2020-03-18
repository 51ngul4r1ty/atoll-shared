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
    console.log(`getPrevSavedBacklogItemByInstanceId: for instance ${instanceId}`);
    let prevItem = null;
    let foundPrevItem = null;
    state.backlogItems.addedItems.forEach((addedItem) => {
        if (addedItem.instanceId === instanceId) {
            console.log(`instance found, found prev item ${JSON.stringify(prevItem)}`);
            foundPrevItem = prevItem;
            return;
        }
        if (addedItem.saved) {
            console.log(`item is saved, ${JSON.stringify(addedItem)}`);
            prevItem = addedItem;
        } else {
            console.log(`item not saved, ${JSON.stringify(addedItem)}`);
        }
    });
    console.log(`getPrevSavedBacklogItemByInstanceId: result ${JSON.stringify(prevItem)}`);
    return prevItem;
};
