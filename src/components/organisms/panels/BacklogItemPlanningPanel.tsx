// externals
import * as React from "react";
import { useState } from "react";
import { Dispatch } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import { AddButton } from "../../molecules/buttons/AddButton";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../molecules/buttons/EditButton";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { buildClassName } from "../../../utils/classNameBuilder";
import { useDispatch } from "react-redux";
import {
    BacklogItemType,
    BacklogItemWithSource,
    BacklogItemSource,
    SaveableBacklogItem
} from "../../../reducers/backlogItemsReducer";

// actions
import {
    updateBacklogItemFields,
    cancelUnsavedBacklogItem,
    saveBacklogItem,
    backlogItemDetailClicked,
    removeBacklogItem
} from "../../../actions/backlogItems";

// utils
import { useRecursiveTimeout } from "../../common/setTimeoutHook";

/* exported interfaces */

export interface PlanningPanelBacklogItem {
    estimate: number | null;
    externalId: string;
    id: string;
    instanceId: number | null;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
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

export const buildDragBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    offsetTop: number,
    width: any
) => {
    return (
        <BacklogItemCard
            key={item.id}
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

export const buildBacklogItemElts = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    highlightAbove: boolean,
    dispatch: Dispatch<any>,
    suppressTopPadding: boolean,
    showDetailMenu: boolean
): JSX.Element[] => {
    if (!item.saved && editMode === EditMode.Edit) {
        const classNameToUse = buildClassName(
            css.backlogItemUserStoryFormRow,
            suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow
        );
        return [
            <SimpleDivider key={`divider-unsaved-form-${item.instanceId}`} />,
            <BacklogItemDetailForm
                key={`unsaved-form-${item.instanceId}`}
                className={classNameToUse}
                instanceId={item.instanceId}
                externalId={item.externalId}
                editing
                estimate={item.estimate}
                rolePhrase={item.rolePhrase}
                storyPhrase={item.storyPhrase}
                reasonPhrase={item.reasonPhrase}
                type={item.type}
                renderMobile={renderMobile}
                onDataUpdate={(fields) => {
                    dispatch(updateBacklogItemFields(fields));
                }}
                onDoneClick={(instanceId) => {
                    dispatch(saveBacklogItem(instanceId));
                }}
                onCancelClick={(instanceId) => {
                    dispatch(cancelUnsavedBacklogItem(instanceId));
                }}
            />
        ];
    }
    if (item.saved) {
        return [
            <SimpleDivider key={`divider-saved-${item.id}`} highlighted={highlightAbove} />,
            <BacklogItemCard
                key={item.id}
                estimate={item.estimate}
                internalId={`${item.id}`}
                itemId={`${item.externalId}`}
                itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                titleText={item.storyPhrase}
                isDraggable={editMode === EditMode.Edit}
                hasDetails={editMode === EditMode.Edit}
                renderMobile={renderMobile}
                marginBelowItem
                onDetailClicked={() => {
                    dispatch(backlogItemDetailClicked(item.id));
                }}
                onRemoveItemClicked={(backlogItemId) => {
                    dispatch(removeBacklogItem(item.id));
                }}
                showDetailMenu={showDetailMenu}
            />
        ];
    }
    return [];
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
    onAddNewBacklogItem: OnAddedNewBacklogItem
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.backlogItemPlanningActionPanel,
        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow
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
    e.preventDefault();
    // if ((e as any).stopImmediatePropagation) {
    //     (e as any).stopImmediatePropagation();
    // } else {
    //     e.stopPropagation();
    // }
};

const getParentWithDataClass = (elt: HTMLElement, dataClass: string) => {
    while (elt && elt.getAttribute("data-class") !== dataClass) {
        elt = elt.parentElement;
    }
    if (elt) {
        return elt;
    }
    return null;
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
    // #region state with refs

    // 1. Refs that are not used for re-rendering

    //    const [cardPositions, _setCardPositions] = useState([]);
    const cardPositionsRef = React.useRef();
    const setCardPositions = (data) => {
        cardPositionsRef.current = data;
        //        _setCardPositions(data);
    };
    //    const [dragItemStartDocumentTop, _setDragItemStartDocumentTop] = useState(null);
    const dragItemStartDocumentTopRef = React.useRef<number>();
    const setDragItemStartDocumentTop = (data) => {
        dragItemStartDocumentTopRef.current = data;
        //        _setDragItemStartDocumentTop(data);
    };
    const dragItemStartOffsetTopRef = React.useRef<number>();
    const setDragItemStartOffsetTop = (data) => {
        dragItemStartOffsetTopRef.current = data;
        //        _setDragItemStartDocumentTop(data);
    };

    //    const [dragStartClientY, _setDragStartClientY] = useState(null);
    const dragStartClientYRef = React.useRef<number>();
    const setDragStartClientY = (data) => {
        dragStartClientYRef.current = data;
        //        _setDragStartClientY(data);
    };
    //    const [dragStartScrollY, _setDragStartScrollY] = useState(null);
    const dragStartScrollYRef = React.useRef<number>();
    const setDragStartScrollY = (data) => {
        dragStartScrollYRef.current = data;
        //        _setDragStartScrollY(data);
    };
    //    const [itemCardWidth, _setItemCardWidth] = useState(null);
    const itemCardWidthRef = React.useRef();
    const setItemCardWidth = (data) => {
        itemCardWidthRef.current = data;
        // _setItemCardWidth(data);
    };

    // 2. Refs that are used for re-rendering

    const [isDragging, _setIsDragging] = useState(false);
    const isDraggingRef = React.useRef();
    const setIsDragging = (data) => {
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
        if (targetIsDragButton(e)) {
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

    const onMouseMove = (e: React.BaseSyntheticEvent<HTMLDivElement>, clientY: number) => {
        if (dragStartClientYRef.current) {
            const mouseDeltaClientY = getMouseDragDistance(clientY);
            if (Math.abs(mouseDeltaClientY) > 5) {
                setIsDragging(true);
            }
            if (isDraggingRef.current) {
                // TODO: Calculate this
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
        return true;
    };

    const onMouseUp = (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
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
        }
        return true;
    };

    const ref = React.createRef<HTMLDivElement>();
    React.useEffect(
        () => {
            const listenerHost = window;
            const removeEventListener = listenerHost.removeEventListener;
            let touchStartListener;
            let touchMoveListener;
            let touchEndListener;
            if (listenerHost) {
                touchStartListener = listenerHost.addEventListener(
                    "touchstart",
                    (e: any) => {
                        if (isSingleTouch(e.touches)) {
                            return onMouseDown(e, touchesToClientY(e.touches));
                        }
                        return true;
                    },
                    { passive: false }
                );
                touchMoveListener = listenerHost.addEventListener(
                    "touchmove",
                    (e: any) => {
                        return onMouseMove(e, touchesToClientY(e.touches));
                    },
                    { passive: false }
                );
                touchEndListener = listenerHost.addEventListener(
                    "touchend",
                    (e: any) => {
                        return onMouseUp(e);
                    },
                    { passive: false }
                );
            }
            const cleanup = () => {
                removeEventListener("touchstart", touchStartListener);
                removeEventListener("touchmove", touchMoveListener);
                removeEventListener("touchend", touchEndListener);
            };
            return cleanup;
        },
        [
            /*cardPositions, itemCardWidth, dragItemId, dragOverItemId, dragItemClientY, isDragging*/
        ]
    );
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
    }, [props.allItems, props.editMode]);
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
                renderElts.push(<SimpleDivider key={`divider-loaded-${item.id}`} />);
                inAddedSection = false;
            }
            if (!inLoadedSection) {
                addActionButtons(renderElts, props.editMode, suppressTopPadding || lastItemWasUnsaved, props.onAddNewBacklogItem);
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
                            dispatch(removeBacklogItem(item.id));
                        }}
                        showDetailMenu={showDetailMenu}
                    />
                );
            }
            if (!isDragItem) {
                const showDetailMenu = item.id === props.openedDetailMenuBacklogItemId;
                const elts = buildBacklogItemElts(
                    props.editMode,
                    item,
                    props.renderMobile,
                    highlightAbove,
                    dispatch,
                    suppressTopPadding || lastItemWasUnsaved,
                    showDetailMenu
                );
                elts.forEach((elt) => {
                    renderElts.push(elt);
                });
            }
        }
        afterPushedItem = item.source === BacklogItemSource.Pushed;
        lastItemWasUnsaved = item.source === BacklogItemSource.Added && !item.saved;
        suppressTopPadding = false;
    });
    if (!inLoadedSection) {
        addActionButtons(renderElts, props.editMode, suppressTopPadding || lastItemWasUnsaved, props.onAddNewBacklogItem);
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
