// interfaces/types
import { BacklogItemWithSource } from "../reducers/backlogItems/backlogItemsReducerTypes";
import { PushState } from "../reducers/types";

// BacklogItemWithSource

export const calcDropDownMenuState = <T>(
    openedItemId: string | null,
    actionItemId: string | null,
    getItemById?: { (openItemId: string | null): T },
    includeItemCheck?: { (item: T): boolean }
) => {
    let result: string;
    if (openedItemId === null) {
        result = actionItemId;
    } else if (openedItemId === actionItemId) {
        result = null;
    } else {
        result = actionItemId;
    }
    if (result) {
        if (getItemById) {
            const item = getItemById(result);
            if (includeItemCheck && !includeItemCheck(item)) {
                //        if (backlogItem.pushState === PushState.Removed) {
                // do not allow this menu to be shown when the item has been deleted
                result = null;
            }
        }
    }
    return result;
};
