export interface TargetData {
    type: string;
    id: string;
}

export const shouldHideDetailMenu = (dataClass: string, itemId: string, itemType: string, openedItemId: string): boolean => {
    if (openedItemId) {
        let hideMenu = false;
        const targetInMenuButton = dataClass === "item-menu-button";
        if (targetInMenuButton && itemId !== openedItemId) {
            hideMenu = true;
        }
        const targetInMenuPanel = dataClass === "item-menu-panel";
        if (!targetInMenuPanel && !targetInMenuButton) {
            hideMenu = true;
        }
        return hideMenu;
    } else {
        return false;
    }
};
