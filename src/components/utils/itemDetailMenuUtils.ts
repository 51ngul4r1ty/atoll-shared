// utils
import { getEltDataAttribute, getParentWithDataClass } from "../../components/common/domUtils";

export interface TargetData {
    type: string;
    id: string;
}

export const getTargetParentMenuButtonData = (target: EventTarget): TargetData | null => {
    const parent = getParentWithDataClass(target as HTMLElement, "item-menu-button");
    if (!parent) {
        return null;
    }
    const id = getEltDataAttribute(parent, "item-id");
    const type = getEltDataAttribute(parent, "item-type");
    return {
        id,
        type
    };
};

export const targetIsInMenuPanel = (target: EventTarget) => {
    return !!getParentWithDataClass(target as HTMLElement, "item-menu-panel");
};

export const targetIsInMenuButton = (target: EventTarget) => {
    return !!getParentWithDataClass(target as HTMLElement, "item-menu-button");
};

export const shouldHideDetailMenu = (targetElt: EventTarget, openedItemId: string): boolean => {
    if (openedItemId) {
        const data = getTargetParentMenuButtonData(targetElt);
        let hideMenu = false;
        if (data && data.id !== openedItemId) {
            hideMenu = true;
        }
        if (!targetIsInMenuPanel(targetElt) && !targetIsInMenuButton(targetElt)) {
            hideMenu = true;
        }
        return hideMenu;
    } else {
        return false;
    }
};
