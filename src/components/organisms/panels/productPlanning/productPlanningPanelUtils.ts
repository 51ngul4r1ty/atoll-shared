// consts/enums
import * as loggingTags from "../../../../constants/loggingTags";

// interfaces/types
import { CardPosition } from "./productPlanningPanelTypes";

// utils
import * as logger from "../../../../utils/logger";
import { getParentWithDataClass } from "../../../common/domUtils";

// costs/enums
import { BELOW_LAST_CARD_ID, PAGE_EDGE_PERCENTAGE, PAGE_SCROLL_PERCENTAGE, SPACER_PREFIX } from "./productPlanningPanelConsts";

const getDragItemIdUnderDocumentTop = (documentTop: number, cardPositions: CardPosition[]) => {
    return getDragItemIdUnderCommon(documentTop, cardPositions);
};

const getHtmlClientHeight = () => {
    const htmlElt = document.getElementsByTagName("html")[0];
    const clientHeight = htmlElt.clientHeight;
    return clientHeight;
};

const percentageToFraction = (percentage: number) => {
    return percentage / 100.0;
};

export const atTopOfPage = (clientY: number) => {
    const clientHeight = getHtmlClientHeight();
    return clientY < clientHeight * percentageToFraction(PAGE_EDGE_PERCENTAGE);
};

export const atBottomOfPage = (clientY: number) => {
    const clientHeight = getHtmlClientHeight();
    return clientY > clientHeight * percentageToFraction(100 - PAGE_EDGE_PERCENTAGE);
};

export const buildSpacerInternalId = (id: string) => {
    return `${SPACER_PREFIX}${id}`;
};

export const isSpacerInternalId = (id: string) => {
    return id.startsWith(SPACER_PREFIX);
};

export const parseSpacerInternalId = (id: string) => {
    return isSpacerInternalId(id) ? id.substring(SPACER_PREFIX.length) : null;
};

const scrollByPageHeightPercentage = (scrollPercent: number, onScroll: { (scrollByY: number) }) => {
    const clientHeight = getHtmlClientHeight();
    const scrollByY = Math.round(clientHeight * percentageToFraction(scrollPercent));
    const beforeScrollY = window.scrollY;
    window.scrollBy(0, scrollByY);
    const afterScrollY = window.scrollY;
    const deltaScrollY = afterScrollY - beforeScrollY;
    if (deltaScrollY) {
        onScroll(deltaScrollY);
    }
};

export const scrollDown = (onScroll: { (scrollByY: number) }) => {
    scrollByPageHeightPercentage(PAGE_SCROLL_PERCENTAGE, (scrollByY) => onScroll(scrollByY));
};

export const scrollUp = (onScroll: { (scrollByY: number) }) => {
    scrollByPageHeightPercentage(-PAGE_SCROLL_PERCENTAGE, (scrollByY) => onScroll(scrollByY));
};

export const handleScroll = (
    deltaY: number,
    cardPositions: CardPosition[],
    dragItemDocumentTop: number,
    dragItemOffsetTop: number,
    setDragItemDocumentTop: { (value: number) },
    setDragItemOffsetTop: { (value: number) },
    dragOverItemId: string,
    setDragOverItemId: { (value: string) }
) => {
    const newDragItemDocumentTop = dragItemDocumentTop + deltaY;
    const newDragItemOffsetTop = dragItemOffsetTop + deltaY;
    setDragItemDocumentTop(newDragItemDocumentTop);
    setDragItemOffsetTop(newDragItemOffsetTop);
    const overItemId = getDragItemIdUnderDocumentTop(newDragItemDocumentTop, cardPositions);
    if (overItemId && overItemId !== dragOverItemId) {
        setDragOverItemId(overItemId);
    }
};

export const preventDefault = (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
    logger.info("preventDefault", [loggingTags.DRAG_BACKLOGITEM]);
    e.preventDefault();
};

export const targetIsDragButton = (e: React.BaseSyntheticEvent<HTMLElement>) => {
    return !!getParentWithDataClass(e.target as HTMLElement, "drag-button");
};

const isBacklogItem = (elt: HTMLElement) => elt && elt.getAttribute("data-class") === "backlogitem";

const getDragItem = (target: EventTarget) => {
    let elt = target as HTMLElement;
    while (elt && !isBacklogItem(elt)) {
        elt = elt.parentElement;
    }
    if (isBacklogItem(elt)) {
        return elt;
    }
    return null;
};

export const getDragItemId = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const id = item.getAttribute("data-id");
        return id;
    }
    return null;
};

export const getDragItemWidth = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const width = item.offsetWidth;
        return width;
    }
    return null;
};

export const getDragItemDocumentTop = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const rect = item.getBoundingClientRect();
        return rect.top + window.scrollY;
    }
    return null;
};

export const getDragItemOffsetTop = (target: EventTarget): number | null => {
    const item = getDragItem(target);
    if (item) {
        const backlogItemDiv = getParentWithDataClass(item, "backlogitem");
        // TODO: Verify that this was necessary by testing drag & drop
        return (backlogItemDiv as HTMLElement).offsetTop || null;
    }
    return null;
};

export const getDragItemIdUnderCommon = (documentTop: number, cardPositions: CardPosition[]) => {
    let result: string = null;
    let lastTop = 0;
    let lastCard: CardPosition = null;
    cardPositions.forEach((item) => {
        if (!result) {
            const dataId = item.id;
            if (documentTop > lastTop && documentTop <= item.documentTop) {
                result = dataId;
            }
            lastTop = item.documentTop;
            lastCard = item;
        }
    });
    if (!result && lastCard) {
        if (documentTop > lastTop && documentTop <= lastCard.documentBottom) {
            result = BELOW_LAST_CARD_ID;
        }
    }
    return result;
};

export const getDragItemIdUnderTarget = (
    e: React.BaseSyntheticEvent<HTMLElement>,
    clientY,
    adjustY: number,
    cardPositions: CardPosition[]
) => {
    const documentTop = clientY + window.scrollY + adjustY;
    return getDragItemIdUnderCommon(documentTop, cardPositions);
};

/**
 * Applies business rule that "unallocated points" takes precedence over "estimate" for product backlog items.
 */
export const computeProductBacklogItemEstimate = (estimate: number, unallocatedPoints: number | undefined) => {
    return unallocatedPoints ? unallocatedPoints : estimate;
};
