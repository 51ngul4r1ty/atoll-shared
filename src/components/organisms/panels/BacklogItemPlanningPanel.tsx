// externals
import * as React from "react";
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
    reorderBacklogItems
} from "../../../actions/backlogItems";
import { useState } from "react";
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
}

export interface BacklogItemPlanningPanelDispatchProps {
    onAddNewBacklogItem: { (itemType: BacklogItemType) };
    onReorderBacklogItems: { (sourceItemId: string, targerItemId: string) };
}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

/* exported components */

export const buildDragBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    documentTop: string,
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
            renderMobile={renderMobile}
            marginBelowItem
            top={documentTop}
            width={width}
        />
    );
};

export const buildBacklogItemElts = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    highlightAbove: boolean,
    dispatch: Dispatch<any>
): JSX.Element[] => {
    if (!item.saved && editMode === EditMode.Edit) {
        return [
            <BacklogItemDetailForm
                key={`unsaved-form-${item.instanceId}`}
                className={css.backlogItemUserStoryFormRow}
                instanceId={item.instanceId}
                externalId={item.externalId}
                editing
                estimate={item.estimate}
                rolePhrase={item.rolePhrase}
                storyPhrase={item.storyPhrase}
                reasonPhrase={item.reasonPhrase}
                type={item.type}
                onDataUpdate={(fields) => {
                    dispatch(updateBacklogItemFields(fields));
                }}
                onDoneClick={(instanceId) => {
                    dispatch(saveBacklogItem(instanceId));
                }}
                onCancelClick={(instanceId) => {
                    dispatch(cancelUnsavedBacklogItem(instanceId));
                }}
            />,
            <SimpleDivider key={`divider-unsaved-form-${item.instanceId}`} />
        ];
    }
    if (item.saved) {
        return [
            <SimpleDivider key={`divider-${item.id}`} highlighted={highlightAbove} />,
            <BacklogItemCard
                key={item.id}
                estimate={item.estimate}
                internalId={`${item.id}`}
                itemId={`${item.externalId}`}
                itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                titleText={item.storyPhrase}
                isDraggable={editMode === EditMode.Edit}
                renderMobile={renderMobile}
                marginBelowItem
            />
        ];
    }
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

const getParentWithDataClass = (elt: HTMLElement, dataClass: string) => {
    while (elt && elt.getAttribute("data-class") !== dataClass) {
        elt = elt.parentElement;
    }
    if (elt) {
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

const targetIsDragButton = (e: React.MouseEvent<HTMLElement>) => {
    return !!getParentWithDataClass(e.target as HTMLElement, "drag-button");
};

const BELOW_LAST_CARD_ID = "##below#last#card##";

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

const getDragItemIdUnderTarget = (e: React.MouseEvent<HTMLElement>, adjustY: number, cardPositions: CardPosition[]) => {
    const documentTop = e.clientY + window.scrollY + adjustY;
    return getDragItemIdUnderCommon(documentTop, cardPositions);
};

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
    setDragItemDocumentTop: { (value: number) },
    dragOverItemId: string,
    setDragOverItemId: { (value: string) }
) => {
    const newDragItemDocumentTop = dragItemDocumentTop + deltaY;
    setDragItemDocumentTop(newDragItemDocumentTop);
    const overItemId = getDragItemIdUnderDocumentTop(newDragItemDocumentTop, cardPositions);
    if (overItemId && overItemId !== dragOverItemId) {
        setDragOverItemId(overItemId);
    }
};

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const [cardPositions, setCardPositions] = useState([]);
    const [itemCardWidth, setItemCardWidth] = useState(null);
    const [dragStartClientY, setDragStartClientY] = useState(null);
    const [dragStartScrollY, setDragStartScrollY] = useState(null);
    const [dragItemId, setDragItemId] = useState(null);
    const [dragOverItemId, setDragOverItemId] = useState(null);
    const [dragItemDocumentTop, setDragItemDocumentTop] = useState(null);
    const [dragItemClientY, setDragItemClientY] = useState(null);
    const [dragItemStartDocumentTop, setDragItemStartDocumentTop] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    useRecursiveTimeout(() => {
        if (isDragging) {
            if (atBottomOfPage(dragItemClientY)) {
                scrollDown((deltaY) => {
                    handleScroll(
                        deltaY,
                        cardPositions,
                        dragItemDocumentTop,
                        setDragItemDocumentTop,
                        dragOverItemId,
                        setDragOverItemId
                    );
                });
            }
            if (atTopOfPage(dragItemClientY)) {
                scrollUp((deltaY) => {
                    handleScroll(
                        deltaY,
                        cardPositions,
                        dragItemDocumentTop,
                        setDragItemDocumentTop,
                        dragOverItemId,
                        setDragOverItemId
                    );
                });
            }
        }
    }, 500);
    const ref = React.createRef<HTMLDivElement>();
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
    }, [props.allItems]);
    const dispatch = useDispatch();
    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
    const actionButtons =
        props.editMode === EditMode.View ? null : (
            <div key="backlogitem-action-buttons" className={css.backlogItemPlanningActionPanel}>
                <AddButton
                    itemName="story"
                    onClick={() => {
                        props.onAddNewBacklogItem("story");
                    }}
                />
                <AddButton
                    itemName="issue"
                    onClick={() => {
                        props.onAddNewBacklogItem("issue");
                    }}
                />
            </div>
        );
    let inLoadedSection = false;
    let inAddedSection = false;
    let afterPushedItem = false;
    let renderElts = [];
    props.allItems.forEach((item) => {
        const isDragItem = isDragging && dragItemId === item.id;
        const isDragOverItem = isDragging && dragOverItemId === item.id;
        if (isDragItem) {
            const elt = buildDragBacklogItemElt(props.editMode, item, props.renderMobile, dragItemDocumentTop, itemCardWidth);
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
                renderElts.push(<SimpleDivider key={`divider-${item.id}`} />);
                inAddedSection = false;
            }
            if (!inLoadedSection) {
                renderElts.push(actionButtons);
            }
            inLoadedSection = true;
        }
        if (item.source === BacklogItemSource.Added || item.source === BacklogItemSource.Loaded) {
            if (isDragOverItem) {
                const cardKey = `none---${item.id}---none`;
                renderElts.push(<SimpleDivider key={`divider-${cardKey}`} />);
                renderElts.push(
                    <BacklogItemCard
                        key={cardKey}
                        estimate={null}
                        internalId={buildSpacerInternalId(item.id)}
                        itemId={null}
                        itemType={BacklogItemTypeEnum.None}
                        titleText={null}
                        isDraggable={props.editMode === EditMode.Edit}
                        renderMobile={props.renderMobile}
                        marginBelowItem
                    />
                );
            }
            if (!isDragItem) {
                const elts = buildBacklogItemElts(props.editMode, item, props.renderMobile, highlightAbove, dispatch);
                elts.forEach((elt) => {
                    renderElts.push(elt);
                });
            }
        }
        afterPushedItem = item.source === BacklogItemSource.Pushed;
    });
    if (inLoadedSection) {
        renderElts.push(<SimpleDivider key="last-divider" />);
    }

    return (
        <div
            ref={ref}
            className={classNameToUse}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                if (targetIsDragButton(e)) {
                    const id = getDragItemId(e.target);
                    if (id) {
                        const width = getDragItemWidth(e.target);
                        const top = getDragItemDocumentTop(e.target);
                        setDragItemDocumentTop(top);
                        setDragItemStartDocumentTop(top);
                        setDragStartClientY(e.clientY);
                        setDragStartScrollY(window.scrollY);
                        setItemCardWidth(width);
                        setDragItemId(id);
                        setDragOverItemId(id);
                    }
                    e.preventDefault();
                }
            }}
            onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
                if (dragStartClientY) {
                    const mouseStartClientYToDocumentTop = dragStartClientY + dragStartScrollY;
                    const mouseClientYToDocumentTop = e.clientY + window.scrollY;
                    const mouseDeltaClientY = mouseClientYToDocumentTop - mouseStartClientYToDocumentTop;
                    const adjustY = dragItemStartDocumentTop - dragStartScrollY - dragStartClientY;
                    if (Math.abs(mouseDeltaClientY) > 5) {
                        setIsDragging(true);
                    }
                    if (isDragging) {
                        setDragItemDocumentTop(dragItemStartDocumentTop + mouseDeltaClientY);
                        setDragItemClientY(e.clientY);
                        const overItemId = getDragItemIdUnderTarget(e, adjustY, cardPositions);
                        if (overItemId) {
                            setDragOverItemId(overItemId);
                        }
                    }
                }
            }}
            onMouseUp={(e: React.MouseEvent<HTMLElement>) => {
                if (isDragging) {
                    if (props.onReorderBacklogItems) {
                        props.onReorderBacklogItems(dragItemId, dragOverItemId);
                    }
                    setIsDragging(false);
                    setDragStartClientY(null);
                    setDragItemId(null);
                    setDragOverItemId(null);
                }
            }}
        >
            {renderElts}
        </div>
    );
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
