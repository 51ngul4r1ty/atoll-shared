// interfaces/types
import { BacklogItemWithSource } from "../reducers/backlogItems/backlogItemsReducerTypes";
import { PushState } from "../reducers/types";

export const calcDropDownMenuState = (
    openedItemId: string | null,
    actionItemId: string | null,
    getBacklogItemById: { (openItemId: string | null): BacklogItemWithSource }
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
        const backlogItem = getBacklogItemById(result);
        if (backlogItem.pushState === PushState.Removed) {
            // do not allow this menu to be shown when the item has been deleted
            result = null;
        }
    }
    return result;
};
