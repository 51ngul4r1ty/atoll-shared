// interfaces/types
import { ProductBacklogItem } from "../../reducers/productBacklogItemsReducer";

export interface AvailableProductBacklogItem extends ProductBacklogItem {
    linkCount: number;
}

export const removeAvailableItem = (availableItems: AvailableProductBacklogItem[], item: ProductBacklogItem) => {
    const countBefore = availableItems.length;
    let i = 0;
    let itemCount = availableItems.length;
    let busy = i < itemCount;
    while (busy) {
        if (
            availableItems[i].id === item.id &&
            availableItems[i].backlogItemId === item.backlogItemId &&
            availableItems[i].nextBacklogItemId === item.nextBacklogItemId
        ) {
            availableItems.splice(i, 1);
            busy = false;
        } else {
            busy = i < itemCount;
        }
        i++;
    }
    const countAfter = availableItems.length;
    if (countBefore <= countAfter) {
        throw new Error(`Unable to remove item - ${item.id}`);
    }
};
