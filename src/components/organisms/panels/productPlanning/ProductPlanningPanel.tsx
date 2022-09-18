// externals
import * as React from "react";
import { useState } from "react";
import { withTranslation } from "react-i18next";

// style
import css from "./ProductPlanningPanel.module.css";

// components
import {
    BacklogItemCard,
    BacklogItemCardType,
    BacklogItemTypeEnum,
    buildBacklogItemKey,
    buildBacklogItemPlanningItemKey,
    buildDividerKey
} from "../../../molecules/cards/BacklogItemCard";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../../common/componentEnums";
import { buildClassName } from "../../../../utils/classNameBuilder";
import { useDispatch } from "react-redux";
import { SaveableBacklogItem } from "../../../../reducers/backlogItems/backlogItemsReducerTypes";
import { Source } from "../../../../reducers/enums";

// actions
import { apiDeleteBacklogItem } from "../../../../actions/apiBacklogItems";
import {
    backlogItemDetailClick,
    editBacklogItem,
    selectProductBacklogItem,
    unselectProductBacklogItem
} from "../../../../actions/backlogItemActions";

// utils
import * as logger from "../../../../utils/logger";
import { useRecursiveTimeout } from "../../../common/setTimeoutHook";
import { BacklogItemPlanningItem } from "../../combo/BacklogItemPlanningItem";
import { buildBacklogDisplayId } from "../../../../utils/backlogItemHelper";

// interfaces/types
import type { ProductPlanningPanelProps } from "./productPlanningPanelTypes";
import type { ItemMenuEventHandlers } from "../../../molecules/menus/menuBuilderTypes";

// consts/enums
import * as loggingTags from "../../../../constants/loggingTags";
import { CardPosition } from "./productPlanningPanelTypes";
import { BELOW_LAST_CARD_ID } from "./productPlanningPanelConsts";

// utils
import {
    atBottomOfPage,
    atTopOfPage,
    buildSpacerInternalId,
    computeProductBacklogItemEstimate,
    getDragItemDocumentTop,
    getDragItemId,
    getDragItemIdUnderTarget,
    getDragItemOffsetTop,
    getDragItemWidth,
    handleScroll,
    preventDefault,
    scrollDown,
    scrollUp,
    targetIsDragButton
} from "./productPlanningPanelUtils";
import { addActionButtons } from "./productPlanningPanelJsxUtils";
import { productBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";

/* exported components */

export const buildDragBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    offsetTop: number,
    width: any
) => {
    const itemEventHandlers: ItemMenuEventHandlers = {
        handleEvent: (eventName: string, itemId: string) => {
            throw Error(`unexpected condition- event ${eventName} should not be triggered while element is being dragged`);
        }
    };
    return (
        <BacklogItemCard
            buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
            cardType={BacklogItemCardType.ProductBacklogCard}
            estimate={computeProductBacklogItemEstimate(item.estimate, item.unallocatedPoints)}
            hasDetails={editMode === EditMode.Edit}
            internalId={`${item.id}`}
            isDraggable={editMode === EditMode.Edit}
            isSelectable={editMode === EditMode.Edit}
            itemId={buildBacklogDisplayId(item.externalId, item.friendlyId)}
            itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
            key={buildBacklogItemKey(item)}
            marginBelowItem
            offsetTop={offsetTop}
            reasonText={item.reasonPhrase}
            renderMobile={renderMobile}
            roleText={item.rolePhrase}
            showDetailMenu={false}
            status={item.status}
            storyEstimate={item.storyEstimate}
            titleText={item.storyPhrase}
            totalParts={item.totalParts}
            unallocatedParts={item.unallocatedParts}
            width={width}
        />
    );
};

export const InnerProductPlanningPanel: React.FC<ProductPlanningPanelProps> = (props) => {
    logger.info("render(InnerBacklogItemPlanningPanel)", [loggingTags.DRAG_BACKLOGITEM]);

    const ref = React.useRef<HTMLDivElement>();

    // #region state with refs

    // 1. Refs that are not used for re-rendering

    const cardPositionsRef = React.useRef();
    const setCardPositions = (data) => {
        cardPositionsRef.current = data;
    };
    const dragItemStartDocumentTopRef = React.useRef<number>();
    const setDragItemStartDocumentTop = (data) => {
        dragItemStartDocumentTopRef.current = data;
    };
    const dragItemStartOffsetTopRef = React.useRef<number>();
    const setDragItemStartOffsetTop = (data) => {
        dragItemStartOffsetTopRef.current = data;
    };
    const dragStartClientYRef = React.useRef<number>();
    const setDragStartClientY = (data) => {
        dragStartClientYRef.current = data;
    };
    const dragStartScrollYRef = React.useRef<number>();
    const setDragStartScrollY = (data) => {
        dragStartScrollYRef.current = data;
    };
    const itemCardWidthRef = React.useRef();
    const setItemCardWidth = (data) => {
        itemCardWidthRef.current = data;
    };

    // 2. Refs that are used for re-rendering

    const [isDragging, _setIsDragging] = useState(false);
    const isDraggingRef = React.useRef();
    const setIsDragging = (data) => {
        logger.info(`setIsDragging:${data}`, [loggingTags.DRAG_BACKLOGITEM]);
        isDraggingRef.current = data;
        _setIsDragging(data);
    };
    const [dragItemId, _setDragItemId] = useState(null);
    const dragItemIdRef = React.useRef();
    const setDragItemId = (data) => {
        dragItemIdRef.current = data;
        _setDragItemId(data);
    };
    const [dragOverItemId, _setDragOverItemId] = useState(null);
    const dragOverItemIdRef = React.useRef();
    const setDragOverItemId = (data) => {
        dragOverItemIdRef.current = data;
        _setDragOverItemId(data);
    };
    const [dragItemDocumentTop, _setDragItemDocumentTop] = useState(null);
    const dragItemDocumentTopRef = React.useRef();
    const setDragItemDocumentTop = (data) => {
        dragItemDocumentTopRef.current = data;
        _setDragItemDocumentTop(data);
    };
    const [dragItemOffsetTop, _setDragItemOffsetTop] = useState(null);
    const dragItemOffsetTopRef = React.useRef<number>();
    const setDragItemOffsetTop = (data) => {
        dragItemOffsetTopRef.current = data;
        _setDragItemOffsetTop(data);
    };
    const [dragItemClientY, _setDragItemClientY] = useState(null);
    const dragItemClientYRef = React.useRef();
    const setDragItemClientY = (data) => {
        dragItemClientYRef.current = data;
        _setDragItemClientY(data);
    };
    // #endregion

    useRecursiveTimeout(() => {
        if (isDraggingRef.current) {
            if (atBottomOfPage(dragItemClientYRef.current)) {
                scrollDown((deltaY) => {
                    handleScroll(
                        deltaY,
                        cardPositionsRef.current,
                        dragItemDocumentTopRef.current,
                        dragItemOffsetTopRef.current,
                        setDragItemDocumentTop,
                        setDragItemOffsetTop,
                        dragOverItemIdRef.current,
                        setDragOverItemId
                    );
                });
            }
            if (atTopOfPage(dragItemClientYRef.current)) {
                scrollUp((deltaY) => {
                    handleScroll(
                        deltaY,
                        cardPositionsRef.current,
                        dragItemDocumentTopRef.current,
                        dragItemOffsetTopRef.current,
                        setDragItemDocumentTop,
                        setDragItemOffsetTop,
                        dragOverItemIdRef.current,
                        setDragOverItemId
                    );
                });
            }
        }
    }, 500);

    const onMouseDown = React.useCallback((e: React.BaseSyntheticEvent<HTMLDivElement>, clientY: number) => {
        setCardPositionsAndWidth(ref.current);
        const logContainer = logger.info(`onMouseDown:${clientY}`, [loggingTags.DRAG_BACKLOGITEM]);
        if (targetIsDragButton(e)) {
            logger.info("target is drag button", [loggingTags.DRAG_BACKLOGITEM], logContainer);
            const id = getDragItemId(e.target);
            if (id) {
                const width = getDragItemWidth(e.target);
                const top = getDragItemDocumentTop(e.target);
                const offsetTop = getDragItemOffsetTop(e.target);
                setDragItemOffsetTop(offsetTop);
                setDragItemStartOffsetTop(offsetTop);
                setDragItemDocumentTop(top);
                setDragItemStartDocumentTop(top);
                setDragStartClientY(clientY);
                setDragStartScrollY(window.scrollY);
                setItemCardWidth(width);
                setDragItemId(id);
                setDragOverItemId(id);
            }
            preventDefault(e);
            return false;
        }
        logger.info("target is NOT drag button", [loggingTags.DRAG_BACKLOGITEM], logContainer);
        return true;
    }, []);

    const getMouseDragDistance = (clientY: number) => {
        const dragStartClientY = dragStartClientYRef.current;
        const dragStartScrollY = dragStartScrollYRef.current;
        const mouseClientYToDocumentTop = clientY + window.scrollY;
        const mouseStartClientYToDocumentTop = dragStartClientY + dragStartScrollY;
        const mouseDeltaClientY = mouseClientYToDocumentTop - mouseStartClientYToDocumentTop;
        return mouseDeltaClientY;
    };

    enum EventType {
        Mouse,
        Touch
    }

    const onMouseMove = (e: React.BaseSyntheticEvent<HTMLDivElement>, clientY: number, eventType: EventType = EventType.Mouse) => {
        const logContext = logger.info(`onMouseMove:${clientY}`, [loggingTags.DRAG_BACKLOGITEM]);
        if (dragStartClientYRef.current) {
            if (eventType === EventType.Touch) {
                preventDefault(e);
            }
            const mouseDeltaClientY = getMouseDragDistance(clientY);
            logger.info(`mouseDelta:${mouseDeltaClientY}`, [loggingTags.DRAG_BACKLOGITEM], logContext);
            if (Math.abs(mouseDeltaClientY) > 5) {
                setIsDragging(true);
            }
            if (isDraggingRef.current) {
                const top = dragItemStartDocumentTopRef.current + mouseDeltaClientY;
                const offsetTop = dragItemStartOffsetTopRef.current + mouseDeltaClientY;
                setDragItemOffsetTop(offsetTop);
                setDragItemDocumentTop(top);
                setDragItemClientY(clientY);
                const adjustY = dragItemStartDocumentTopRef.current - dragStartScrollYRef.current - dragStartClientYRef.current;
                const overItemId = getDragItemIdUnderTarget(e, clientY, adjustY, cardPositionsRef.current);
                if (overItemId) {
                    setDragOverItemId(overItemId);
                }
            }
            return false;
        }
        logger.info("not dragging, bypassed preventDefault", [loggingTags.DRAG_BACKLOGITEM], logContext);
        return true;
    };

    const isLastCard = (id: string) => id === lastItemId;

    const getPrevIdForItem = (id: string) => {
        let idx = 0;
        let lastId: string = null;
        let result: string = null;
        while (idx < props.allItems.length && !result) {
            const item = props.allItems[idx];
            if (item.id === id) {
                result = lastId;
            }
            lastId = item.id;
            idx++;
        }
        return result;
    };

    const draggingAboveTopItem = (dragOverItemId: string, dragItemId: string) => dragOverItemId === dragItemId;

    const draggingBelowBottomItem = (dragOverItemId: string, dragItemId: string) =>
        dragOverItemId === BELOW_LAST_CARD_ID && isLastCard(dragItemId);

    const draggingOverSameMiddleItem = (dragOverItemId: string, dragItemId: string) =>
        dragItemId === getPrevIdForItem(dragOverItemId);

    const isOverSameCard = (overItemId: string, itemId: string) => {
        return (
            draggingBelowBottomItem(overItemId, itemId) ||
            draggingAboveTopItem(overItemId, itemId) ||
            draggingOverSameMiddleItem(overItemId, itemId)
        );
    };

    const getTrueItemId = (id: string) => (id === BELOW_LAST_CARD_ID ? null : id);

    const onMouseUp = (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
        logger.info(`onMouseUp`, [loggingTags.DRAG_BACKLOGITEM]);

        if (isDraggingRef.current) {
            if (props.onReorderBacklogItems) {
                if (!isOverSameCard(dragOverItemIdRef.current, dragItemIdRef.current)) {
                    props.onReorderBacklogItems(dragItemIdRef.current, getTrueItemId(dragOverItemIdRef.current));
                }
            }
            setIsDragging(false);
            setDragStartClientY(null);
            setDragItemId(null);
            setDragOverItemId(null);
            return false;
        } else if (dragStartClientYRef.current) {
            setDragStartClientY(null);
            setDragItemId(null);
            setDragOverItemId(null);
            return false;
        }
        return true;
    };

    React.useEffect(() => {
        logger.info("setting up event listeners for touchstart, touchmove, touchend", [loggingTags.DRAG_BACKLOGITEM]);
        const listenerHost = window;
        const removeEventListener = listenerHost.removeEventListener;
        let touchStartListener;
        let touchMoveListener;
        let touchEndListener;
        if (listenerHost) {
            logger.info("listenerHost set", [loggingTags.DRAG_BACKLOGITEM]);
            touchStartListener = listenerHost.addEventListener(
                "touchstart",
                (e: any) => {
                    const logInfo = logger.info("touchstart", [loggingTags.DRAG_BACKLOGITEM]);
                    if (isSingleTouch(e.touches)) {
                        const result = onMouseDown(e, touchesToClientY(e.touches));
                        logger.info(`isSingleTouch, returning ${result}`, [loggingTags.DRAG_BACKLOGITEM], logInfo);
                        return result;
                    }
                    logger.info("not single touch, returning true", [loggingTags.DRAG_BACKLOGITEM], logInfo);
                    return true;
                },
                { passive: false }
            );
            touchMoveListener = listenerHost.addEventListener(
                "touchmove",
                (e: any) => {
                    const result = onMouseMove(e, touchesToClientY(e.touches), EventType.Touch);
                    logger.info(`touchmove, returning ${result}`, [loggingTags.DRAG_BACKLOGITEM]);
                    return result;
                },
                { passive: false }
            );
            touchEndListener = listenerHost.addEventListener(
                "touchend",
                (e: any) => {
                    const result = onMouseUp(e);
                    logger.info(`touchend, returning ${result}`, [loggingTags.DRAG_BACKLOGITEM]);
                    return result;
                },
                { passive: false }
            );
        }
        const cleanup = () => {
            logger.info("cleanup event listeners for touchstart, touchmove, touchend", [loggingTags.DRAG_BACKLOGITEM]);
            removeEventListener("touchstart", touchStartListener);
            removeEventListener("touchmove", touchMoveListener);
            removeEventListener("touchend", touchEndListener);
        };
        return cleanup;
    }, []);
    const getCardPositionsAndWidth = (refCurrent: HTMLDivElement) => {
        const newCardPositions: CardPosition[] = [];
        const computedStyle = getComputedStyle(refCurrent);
        const width = refCurrent?.offsetWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        const elts = refCurrent.querySelectorAll(`[data-class='backlogitem']`);
        elts.forEach((elt) => {
            const id = elt.getAttribute("data-id");
            const rect = elt.getBoundingClientRect();
            newCardPositions.push({ id, documentTop: rect.top + window.scrollY, documentBottom: rect.bottom + window.scrollY });
        });
        return { width, newCardPositions };
    };
    const setCardPositionsAndWidth = (refCurrent: HTMLDivElement) => {
        try {
            const { newCardPositions, width } = getCardPositionsAndWidth(refCurrent);
            setCardPositions(newCardPositions);
            setItemCardWidth(width);
        } catch (err) {
            logger.warn(
                `Unable to setCardPositionsAndWidth "${err}"`,
                [loggingTags.DRAG_BACKLOGITEM],
                logger.LOGGING_CONTEXT_DEFAULT,
                (err as Error).stack
            );
        }
    };
    React.useEffect(() => {
        setCardPositionsAndWidth(ref.current);
    }, [props.allItems, props.editMode, props.renderMobile]);
    const dispatch = useDispatch();
    let inLoadedSection = false;
    let inAddedSection = false;
    let afterPushedItem = false;
    let renderElts = [];
    let suppressTopPadding = true;
    let lastItemWasUnsaved = false;
    let lastItemId: string = null;
    props.allItems.forEach((item) => {
        const isDragItem = isDraggingRef.current && dragItemIdRef.current === item.id;
        const isDragOverItem = isDraggingRef.current && dragOverItemIdRef.current === item.id;
        if (isDragItem) {
            const elt = buildDragBacklogItemElt(
                props.editMode,
                item,
                props.renderMobile,
                dragItemOffsetTopRef.current,
                itemCardWidthRef.current
            );
            renderElts.push(elt);
        }
        let highlightAbove = false;
        if (item.source === Source.Added) {
            inAddedSection = true;
            highlightAbove = afterPushedItem;
        }
        if (item.source === Source.Loaded) {
            highlightAbove = afterPushedItem;
            if (inAddedSection) {
                renderElts.push(<SimpleDivider key={buildDividerKey(item)} />);
                inAddedSection = false;
            }
            if (!inLoadedSection) {
                const suppressButtonSpacing = !!props.renderMobile;
                addActionButtons(
                    renderElts,
                    props.editMode,
                    suppressTopPadding || lastItemWasUnsaved,
                    suppressButtonSpacing,
                    props.onAddNewBacklogItemForm
                );
            }
            inLoadedSection = true;
        }
        if (item.source === Source.Added || item.source === Source.Loaded) {
            if (isDragOverItem) {
                const cardKey = `none---${item.id}---none`;
                renderElts.push(<SimpleDivider key={`divider-${cardKey}`} />);
                const showDetailMenu = item.id === props.openedDetailMenuBacklogItemId;
                const itemEventHandlers: ItemMenuEventHandlers = {
                    handleEvent: (eventName: string, itemId: string) => {
                        if (eventName === "onRemoveItemClick") {
                            dispatch(apiDeleteBacklogItem(item.id));
                        } else if (eventName === "onEditItemClick") {
                            dispatch(editBacklogItem(item.id));
                        } else {
                            throw Error(`${eventName} is not handled`);
                        }
                    }
                };
                const dragOverItemBacklogItemCard = (
                    <BacklogItemCard
                        key={cardKey}
                        buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
                        cardType={BacklogItemCardType.ProductBacklogCard}
                        estimate={null}
                        hasDetails={props.editMode === EditMode.Edit}
                        internalId={buildSpacerInternalId(item.id)}
                        isDraggable={props.editMode === EditMode.Edit}
                        isSelectable={props.editMode === EditMode.Edit}
                        itemId={null}
                        itemType={BacklogItemTypeEnum.None}
                        marginBelowItem
                        reasonText={null}
                        renderMobile={props.renderMobile}
                        roleText={null}
                        status={item.status}
                        storyEstimate={item.storyEstimate}
                        titleText={null}
                        totalParts={item.totalParts}
                        unallocatedParts={item.unallocatedParts}
                        onDetailClick={() => {
                            dispatch(backlogItemDetailClick(item.id, props.strictMode));
                        }}
                        onCheckboxChange={(checked) => {
                            if (checked) {
                                dispatch(selectProductBacklogItem(item.id));
                            } else {
                                dispatch(unselectProductBacklogItem(item.id));
                            }
                        }}
                        showDetailMenu={showDetailMenu}
                    />
                );
                renderElts.push(dragOverItemBacklogItemCard);
            }
            const showItem = !isDragItem;
            const showDetailMenu = item.id === props.openedDetailMenuBacklogItemId;
            renderElts.push(
                <BacklogItemPlanningItem
                    key={buildBacklogItemPlanningItemKey(item)}
                    {...item}
                    busyJoiningUnallocatedParts={props.busyJoiningUnallocatedParts}
                    busySplittingStory={props.busySplittingStory}
                    editMode={props.editMode}
                    hidden={!showItem}
                    highlightAbove={highlightAbove}
                    renderMobile={props.renderMobile}
                    showDetailMenu={showDetailMenu}
                    strictMode={props.strictMode}
                    suppressTopPadding={suppressTopPadding || lastItemWasUnsaved}
                />
            );
        }
        afterPushedItem = item.source === Source.Pushed;
        lastItemWasUnsaved = item.source === Source.Added && !item.saved;
        suppressTopPadding = false;
        lastItemId = item.id;
    });
    if (!inLoadedSection) {
        const suppressButtonSpacing = !!props.renderMobile;
        addActionButtons(
            renderElts,
            props.editMode,
            suppressTopPadding || lastItemWasUnsaved,
            suppressButtonSpacing,
            props.onAddNewBacklogItemForm
        );
    }
    if (inLoadedSection) {
        renderElts.push(<SimpleDivider key="last-divider" />);
    }

    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.className);
    /* NOTE: Handlers were here */
    const isSingleTouch = (touches: React.TouchList) => touches.length === 1;
    const touchesToClientY = (touches: React.TouchList): number | null => {
        if (touches.length === 1) {
            return touches[0].clientY;
        }
        return null;
    };
    return (
        <div
            ref={ref}
            className={classNameToUse}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => onMouseDown(e as any, e.clientY)}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => onMouseMove(e as any, e.clientY)}
            onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => onMouseUp(e as any)}
        >
            {renderElts}
        </div>
    );
};

export const ProductPlanningPanel = withTranslation()(InnerProductPlanningPanel);
