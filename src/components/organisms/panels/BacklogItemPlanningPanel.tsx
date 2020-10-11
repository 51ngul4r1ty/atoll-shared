// externals
import * as React from "react";
import { useState } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import { AddButton } from "../../molecules/buttons/AddButton";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../molecules/buttons/EditButton";
import { buildClassName } from "../../../utils/classNameBuilder";
import { useDispatch } from "react-redux";
import {
    BacklogItemType,
    BacklogItemWithSource,
    BacklogItemSource,
    SaveableBacklogItem
} from "../../../reducers/backlogItemsReducer";

// actions
import { apiDeleteBacklogItem } from "../../../actions/apiBacklogItems";
import { backlogItemDetailClicked, editBacklogItem } from "../../../actions/backlogItems";

// utils
import * as logger from "../../../utils/logger";
import { useRecursiveTimeout } from "../../common/setTimeoutHook";
import { BacklogItemPlanningItem } from "../combo/BacklogItemPlanningItem";
import { getParentWithDataClass } from "../../common/domUtils";

// consts/enums
import * as loggingTags from "../../../constants/loggingTags";

// interfaces/types
import { StoryPhrases } from "../../../types";

/* exported interfaces */

export interface PlanningPanelBacklogItem extends StoryPhrases {
    estimate: number | null;
    friendlyId: string;
    externalId: string;
    id: string;
    instanceId: number | null;
    type: BacklogItemType;
    saved: boolean;
}

export interface BacklogItemPlanningPanelStateProps {
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
    renderMobile?: boolean;
    openedDetailMenuBacklogItemId: string | null;
}

export interface OnAddedNewBacklogItem {
    (itemType: BacklogItemType);
}

export interface OnReorderBacklogItems {
    (sourceItemId: string, targerItemId: string);
}

export interface BacklogItemPlanningPanelDispatchProps {
    onAddNewBacklogItem: OnAddedNewBacklogItem;
    onReorderBacklogItems: OnReorderBacklogItems;
}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

/* exported components */

export const buildUniqueItemKey = (props: SaveableBacklogItem, componentPrefix: string): string => {
    return props.id ? `${componentPrefix}-id-${props.id}` : `${componentPrefix}-i-${props.instanceId}`;
};

export const buildBacklogItemKey = (props: SaveableBacklogItem): string => {
    return buildUniqueItemKey(props, "bic");
};

export const buildBacklogItemPlanningItemKey = (props: SaveableBacklogItem): string => {
    return buildUniqueItemKey(props, "bipi");
};

export const buildDividerKey = (props: SaveableBacklogItem): string => {
    return buildUniqueItemKey(props, "div-l");
};

export const buildDragBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    offsetTop: number,
    width: any
) => {
    return (
        <BacklogItemCard
            key={buildBacklogItemKey(item)}
            estimate={item.estimate}
            internalId={`${item.id}`}
            itemId={`${item.externalId}`}
            itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
            titleText={item.storyPhrase}
            isDraggable={editMode === EditMode.Edit}
            hasDetails={editMode === EditMode.Edit}
            renderMobile={renderMobile}
            marginBelowItem
            offsetTop={offsetTop}
            width={width}
            showDetailMenu={false}
        />
    );
};

const BELOW_LAST_CARD_ID = "##below#last#card##";

const getDragItemIdUnderDocumentTop = (documentTop: number, cardPositions: CardPosition[]) => {
    return getDragItemIdUnderCommon(documentTop, cardPositions);
};

const getHtmlClientHeight = () => {
    const htmlElt = document.getElementsByTagName("html")[0];
    const clientHeight = htmlElt.clientHeight;
    return clientHeight;
};

const PAGE_EDGE_PERCENTAGE = 5;
const PAGE_SCROLL_PERCENTAGE = 5;

const percentageToFraction = (percentage: number) => {
    return percentage / 100.0;
};

const atTopOfPage = (clientY: number) => {
    const clientHeight = getHtmlClientHeight();
    return clientY < clientHeight * percentageToFraction(PAGE_EDGE_PERCENTAGE);
};

const atBottomOfPage = (clientY: number) => {
    const clientHeight = getHtmlClientHeight();
    return clientY > clientHeight * percentageToFraction(100 - PAGE_EDGE_PERCENTAGE);
};

const SPACER_PREFIX = "spacer---";

export const buildSpacerInternalId = (id: string) => {
    return `${SPACER_PREFIX}${id}`;
};

export const isSpacerInternalId = (id: string) => {
    return id.startsWith(SPACER_PREFIX);
};

export const parseSpacerInternalId = (id: string) => {
    return isSpacerInternalId(id) ? id.substring(SPACER_PREFIX.length) : null;
};

interface CardPosition {
    id: string;
    documentTop: number;
    documentBottom: number;
}

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

const scrollDown = (onScroll: { (scrollByY: number) }) => {
    scrollByPageHeightPercentage(PAGE_SCROLL_PERCENTAGE, (scrollByY) => onScroll(scrollByY));
};

const scrollUp = (onScroll: { (scrollByY: number) }) => {
    scrollByPageHeightPercentage(-PAGE_SCROLL_PERCENTAGE, (scrollByY) => onScroll(scrollByY));
};

const handleScroll = (
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

const addActionButtons = (
    renderElts: any[],
    editMode: EditMode,
    suppressTopPadding: boolean,
    onAddNewBacklogItem: OnAddedNewBacklogItem,
    renderMobile: boolean
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.backlogItemPlanningActionPanel,
        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow,
        renderMobile ? css.mobile : null
    );
    renderElts.push(
        <div key="backlogitem-action-buttons" className={actionButtonsClassName}>
            <AddButton
                itemName="story"
                onClick={() => {
                    onAddNewBacklogItem("story");
                }}
            />
            <AddButton
                itemName="issue"
                onClick={() => {
                    onAddNewBacklogItem("issue");
                }}
            />
        </div>
    );
};

const preventDefault = (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
    logger.info("preventDefault", [loggingTags.DRAG_BACKLOGITEM]);
    e.preventDefault();
};

const targetIsDragButton = (e: React.BaseSyntheticEvent<HTMLElement>) => {
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

const getDragItemId = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const id = item.getAttribute("data-id");
        return id;
    }
    return null;
};

const getDragItemWidth = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const width = item.offsetWidth;
        return width;
    }
    return null;
};

const getDragItemDocumentTop = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const rect = item.getBoundingClientRect();
        return rect.top + window.scrollY;
    }
    return null;
};

const getDragItemOffsetTop = (target: EventTarget): number | null => {
    const item = getDragItem(target);
    if (item) {
        const backlogItemDiv = getParentWithDataClass(item, "backlogitem");
        return item.offsetTop;
    }
    return null;
};

const getDragItemIdUnderCommon = (documentTop: number, cardPositions: CardPosition[]) => {
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

const getDragItemIdUnderTarget = (
    e: React.BaseSyntheticEvent<HTMLElement>,
    clientY,
    adjustY: number,
    cardPositions: CardPosition[]
) => {
    const documentTop = clientY + window.scrollY + adjustY;
    return getDragItemIdUnderCommon(documentTop, cardPositions);
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
                addActionButtons(
                    renderElts,
                    props.editMode,
                    suppressTopPadding || lastItemWasUnsaved,
                    props.onAddNewBacklogItem,
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
                renderElts.push(
                    <BacklogItemCard
                        key={cardKey}
                        estimate={null}
                        internalId={buildSpacerInternalId(item.id)}
                        itemId={null}
                        itemType={BacklogItemTypeEnum.None}
                        titleText={null}
                        isDraggable={props.editMode === EditMode.Edit}
                        hasDetails={props.editMode === EditMode.Edit}
                        renderMobile={props.renderMobile}
                        marginBelowItem
                        onDetailClicked={() => {
                            dispatch(backlogItemDetailClicked(item.id));
                        }}
                        onRemoveItemClicked={(backlogItemId) => {
                            dispatch(apiDeleteBacklogItem(item.id));
                        }}
                        onEditItemClicked={(backlogItemId) => {
                            dispatch(editBacklogItem(item.id));
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
        addActionButtons(
            renderElts,
            props.editMode,
            suppressTopPadding || lastItemWasUnsaved,
            props.onAddNewBacklogItem,
            props.renderMobile
        );
    }
    if (inLoadedSection) {
        renderElts.push(<SimpleDivider key="last-divider" />);
    }

    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
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
