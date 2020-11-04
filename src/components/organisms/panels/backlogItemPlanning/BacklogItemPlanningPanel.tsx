// externals
import * as React from "react";
import { useState } from "react";
import { withTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import {
    BacklogItemCard,
    BacklogItemTypeEnum,
    buildBacklogItemKey,
    buildBacklogItemPlanningItemKey,
    buildDividerKey,
    calcItemId,
    ItemMenuBuilder,
    ItemMenuEventHandlers
} from "../../../molecules/cards/BacklogItemCard";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";
import { buildClassName } from "../../../../utils/classNameBuilder";
import { useDispatch } from "react-redux";
import { BacklogItemSource, SaveableBacklogItem } from "../../../../reducers/backlogItems/backlogItemsReducerTypes";

// actions
import { apiDeleteBacklogItem } from "../../../../actions/apiBacklogItems";
import {
    backlogItemDetailClicked,
    editBacklogItem,
    selectProductBacklogItem,
    unselectProductBacklogItem
} from "../../../../actions/backlogItemActions";

// utils
import * as logger from "../../../../utils/logger";
import { useRecursiveTimeout } from "../../../common/setTimeoutHook";
import { BacklogItemPlanningItem } from "../../combo/BacklogItemPlanningItem";

// consts/enums
import * as loggingTags from "../../../../constants/loggingTags";
import { BacklogItemPlanningPanelProps, CardPosition } from "./backlogItemPlanningPanelTypes";
import {
    atBottomOfPage,
    atTopOfPage,
    buildSpacerInternalId,
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
} from "./backlogItemPlanningPanelUtils";
import { addActionButtons } from "./backlogItemPlanningPanelJsxUtils";
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
            key={buildBacklogItemKey(item)}
            buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
            estimate={item.estimate}
            internalId={`${item.id}`}
            itemId={calcItemId(item.externalId, item.friendlyId)}
            itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
            titleText={item.storyPhrase}
            isDraggable={editMode === EditMode.Edit}
            hasDetails={editMode === EditMode.Edit}
            isSelectable={editMode === EditMode.Edit}
            renderMobile={renderMobile}
            marginBelowItem
            offsetTop={offsetTop}
            width={width}
            showDetailMenu={false}
        />
    );
};

export const InnerBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    logger.info("render(InnerBacklogItemPlanningPanel)", [loggingTags.DRAG_BACKLOGITEM]);
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

    const onMouseDown = (e: React.BaseSyntheticEvent<HTMLDivElement>, clientY: number) => {
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
    };

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
        const loggingContainer = logger.info(`onMouseMove:${clientY}`, [loggingTags.DRAG_BACKLOGITEM]);
        if (dragStartClientYRef.current) {
            if (eventType === EventType.Touch) {
                preventDefault(e);
            }
            const mouseDeltaClientY = getMouseDragDistance(clientY);
            logger.info(`mouseDelta:${mouseDeltaClientY}`, [loggingTags.DRAG_BACKLOGITEM], loggingContainer);
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
        logger.info("not dragging, bypassed preventDefault", [loggingTags.DRAG_BACKLOGITEM], loggingContainer);
        return true;
    };

    const onMouseUp = (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
        logger.info(`onMouseUp`, [loggingTags.DRAG_BACKLOGITEM]);

        if (isDraggingRef.current) {
            if (props.onReorderBacklogItems) {
                const dragOverItemIdToUse = dragOverItemIdRef.current === BELOW_LAST_CARD_ID ? null : dragOverItemIdRef.current;
                // NOTE: We always drag the item to a position before the "drag over item"
                if (dragItemIdRef.current !== dragOverItemIdToUse) {
                    props.onReorderBacklogItems(dragItemIdRef.current, dragOverItemIdToUse);
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

    const ref = React.createRef<HTMLDivElement>();
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
    React.useEffect(() => {
        const newCardPositions: CardPosition[] = [];
        const computedStyle = getComputedStyle(ref.current);
        const width = ref.current?.offsetWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        const elts = ref.current.querySelectorAll(`[data-class='backlogitem']`);
        elts.forEach((elt) => {
            const id = elt.getAttribute("data-id");
            const rect = elt.getBoundingClientRect();
            newCardPositions.push({ id, documentTop: rect.top + window.scrollY, documentBottom: rect.bottom + window.scrollY });
        });
        setCardPositions(newCardPositions);
        setItemCardWidth(width);
    }, [props.allItems, props.editMode, props.renderMobile]);
    const dispatch = useDispatch();
    let inLoadedSection = false;
    let inAddedSection = false;
    let afterPushedItem = false;
    let renderElts = [];
    let suppressTopPadding = true;
    let lastItemWasUnsaved = false;
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
        if (item.source === BacklogItemSource.Added) {
            inAddedSection = true;
            highlightAbove = afterPushedItem;
        }
        if (item.source === BacklogItemSource.Loaded) {
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
                    props.onAddNewBacklogItemForm,
                    props.renderMobile
                );
            }
            inLoadedSection = true;
        }
        if (item.source === BacklogItemSource.Added || item.source === BacklogItemSource.Loaded) {
            if (isDragOverItem) {
                const cardKey = `none---${item.id}---none`;
                renderElts.push(<SimpleDivider key={`divider-${cardKey}`} />);
                const showDetailMenu = item.id === props.openedDetailMenuBacklogItemId;
                const itemEventHandlers: ItemMenuEventHandlers = {
                    handleEvent: (eventName: string, itemId: string) => {
                        if (eventName === "onRemoveItemClicked") {
                            dispatch(apiDeleteBacklogItem(item.id));
                        } else if (eventName === "onEditItemClicked") {
                            dispatch(editBacklogItem(item.id));
                        } else {
                            throw Error(`${eventName} is not handled`);
                        }
                    }
                };
                renderElts.push(
                    <BacklogItemCard
                        key={cardKey}
                        buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
                        estimate={null}
                        internalId={buildSpacerInternalId(item.id)}
                        itemId={null}
                        itemType={BacklogItemTypeEnum.None}
                        titleText={null}
                        isDraggable={props.editMode === EditMode.Edit}
                        hasDetails={props.editMode === EditMode.Edit}
                        isSelectable={props.editMode === EditMode.Edit}
                        renderMobile={props.renderMobile}
                        marginBelowItem
                        onDetailClicked={() => {
                            dispatch(backlogItemDetailClicked(item.id));
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
            }
            const showItem = !isDragItem;
            const showDetailMenu = item.id === props.openedDetailMenuBacklogItemId;
            renderElts.push(
                <BacklogItemPlanningItem
                    key={buildBacklogItemPlanningItemKey(item)}
                    {...item}
                    editMode={props.editMode}
                    renderMobile={props.renderMobile}
                    highlightAbove={highlightAbove}
                    suppressTopPadding={suppressTopPadding || lastItemWasUnsaved}
                    showDetailMenu={showDetailMenu}
                    hidden={!showItem}
                />
            );
        }
        afterPushedItem = item.source === BacklogItemSource.Pushed;
        lastItemWasUnsaved = item.source === BacklogItemSource.Added && !item.saved;
        suppressTopPadding = false;
    });
    if (!inLoadedSection) {
        const suppressButtonSpacing = !!props.renderMobile;
        addActionButtons(
            renderElts,
            props.editMode,
            suppressTopPadding || lastItemWasUnsaved,
            suppressButtonSpacing,
            props.onAddNewBacklogItemForm,
            props.renderMobile
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

export const BacklogItemPlanningPanel = withTranslation()(InnerBacklogItemPlanningPanel);
