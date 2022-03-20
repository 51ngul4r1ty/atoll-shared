/**
 * Determines the drop down menu state based on the provided inputs.
 * @param openedItemId ID of existing item that has menu displayed (null if none)
 * @param actionItemId ID of item that's opening the item detail menu
 * @param getItemById callback to retrieve item using this ID (optional but must be paired with includeItemCheck)
 * @param includeItemCheck callback to check whether to include this item (optional but must be paired with getItemById)
 * @returns
 */
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
            if (!includeItemCheck) {
                throw new Error("calcDropDownMenuState failed because getItemById provided, but includeItemCheck was not!");
            } else {
                const item = getItemById(result);
                if (!includeItemCheck(item)) {
                    result = null;
                }
            }
        }
    }
    return result;
};
