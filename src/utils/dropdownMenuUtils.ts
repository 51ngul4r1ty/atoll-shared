/**
 * Determines the drop down menu state based on the provided inputs.
 * @param openedItemId ID of existing item that has menu displayed (null if none)
 * @param actionItemId ID of item that's opening the item detail menu
 * @param getItemById callback to retrieve item using this ID (optional but must be paired with includeItemCheck)
 * @param includeItemCheck callback to check whether to include this item (optional but must be paired with getItemById)
 * @returns
 */
export const calcToggledOpenMenuItemId = <T>(
    openedItemId: string | null,
    actionItemId: string | null,
    strictMode: boolean,
    getItemById?: { (openItemId: string | null): T },
    includeItemCheck?: { (item: T): boolean }
) => {
    let resultItemId: string;
    if (openedItemId === null) {
        resultItemId = actionItemId;
    } else if (openedItemId === actionItemId) {
        resultItemId = null;
    } else {
        resultItemId = actionItemId;
    }
    if (resultItemId) {
        if (getItemById) {
            if (!includeItemCheck) {
                throw new Error("calcToggledOpenMenuItemId failed because getItemById provided, but includeItemCheck was not!");
            } else {
                const item = getItemById(resultItemId);
                if (strictMode) {
                    throw new Error(
                        `Unexpected condition - calcToggledOpenMenuItemId expects getItemById(${resultItemId}) to return an item`
                    );
                }
                if (!includeItemCheck(item)) {
                    resultItemId = null;
                }
            }
        }
    }
    return resultItemId;
};

export const alreadyShowingMenu = (openedDetailMenuItemId: string, newTargetMenuItemId: string) => {
    return openedDetailMenuItemId === newTargetMenuItemId;
};
