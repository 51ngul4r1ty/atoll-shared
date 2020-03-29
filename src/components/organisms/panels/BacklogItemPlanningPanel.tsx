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
import { updateBacklogItemFields, cancelUnsavedBacklogItem, saveBacklogItem } from "../../../actions/backlogItems";
import { useState } from "react";

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
}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

/* exported components */

export const buildDragBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    top: string,
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
            top={top}
            width={width}
        />
    );
};

export const buildBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    highlightAbove: boolean,
    dispatch: Dispatch<any>
) => {
    if (!item.saved && editMode === EditMode.Edit) {
        return (
            <>
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
                />
                <SimpleDivider />
            </>
        );
    }
    if (item.saved) {
        return (
            <>
                <SimpleDivider key={`divider-${item.id}`} highlighted={highlightAbove} />
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
            </>
        );
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

const getDragItemIdUnderTarget = (e: React.MouseEvent<HTMLElement>, adjustY: number) => {
    let result: string = null;
    const target = e.target as HTMLElement;
    const clientY = e.clientY + adjustY;
    const item = getDragItem(target);
    const container = item.parentElement;
    let lastTop = 0;
    for (let i = 0; i < container.children.length; i++) {
        if (!result) {
            const item = container.children.item(i);
            if (item.hasAttribute("data-id")) {
                const dataId = item.getAttribute("data-id");
                const trueDataId = isSpacerInternalId(dataId) ? parseSpacerInternalId(dataId) : dataId;
                const rect = item.getBoundingClientRect();
                if (clientY > lastTop && clientY <= rect.top) {
                    result = trueDataId;
                }
                lastTop = rect.top;
            }
        }
    }
    return result;
};

const getDragItemWidth = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const width = item.offsetWidth;
        return width;
    }
    return null;
};

const getDragItemTop = (target: EventTarget) => {
    const item = getDragItem(target);
    if (item) {
        const rect = item.getBoundingClientRect();
        return rect.top;
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

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const [itemCardWidth, setItemCardWidth] = useState(null);
    const [dragStartClientY, setDragStartClientY] = useState(null);
    const [dragItemId, setDragItemId] = useState(null);
    const [dragOverItemId, setDragOverItemId] = useState(null);
    const [dragItemTop, setDragItemTop] = useState(null);
    const [dragItemStartTop, setDragItemStartTop] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const ref = React.createRef<HTMLDivElement>();
    React.useEffect(() => {
        const computedStyle = getComputedStyle(ref.current);
        const width = ref.current?.offsetWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        setItemCardWidth(width);
    }, []);
    const dispatch = useDispatch();
    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
    const actionButtons =
        props.editMode === EditMode.View ? null : (
            <div className={css.backlogItemPlanningActionPanel}>
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
            const elt = buildDragBacklogItemElt(props.editMode, item, props.renderMobile, dragItemTop, itemCardWidth);
            renderElts.push(elt);
        } else {
            let highlightAbove = false;
            if (item.source === BacklogItemSource.Added) {
                inAddedSection = true;
                highlightAbove = afterPushedItem;
            }
            if (item.source === BacklogItemSource.Loaded) {
                highlightAbove = afterPushedItem;
                if (inAddedSection) {
                    renderElts.push(<SimpleDivider />);
                    inAddedSection = false;
                }
                if (!inLoadedSection) {
                    renderElts.push(actionButtons);
                }
                inLoadedSection = true;
            }
            if (item.source === BacklogItemSource.Added || item.source === BacklogItemSource.Loaded) {
                if (isDragOverItem) {
                    // insert gap here
                    renderElts.push(<SimpleDivider />);
                    renderElts.push(
                        <BacklogItemCard
                            key={`none---${item.id}---none`}
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
                const elt = buildBacklogItemElt(props.editMode, item, props.renderMobile, highlightAbove, dispatch);
                renderElts.push(elt);
            }
            afterPushedItem = item.source === BacklogItemSource.Pushed;
        }
    });
    if (inLoadedSection) {
        renderElts.push(<SimpleDivider />);
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
                        const top = getDragItemTop(e.target);
                        setDragItemTop(top);
                        setDragItemStartTop(top);
                        setDragStartClientY(e.clientY);
                        setItemCardWidth(width);
                        setDragItemId(id);
                        setDragOverItemId(id);
                    }
                    e.preventDefault();
                }
            }}
            onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
                if (dragStartClientY) {
                    const deltaY = e.clientY - dragStartClientY;
                    const deltaYToTop = dragItemStartTop - dragStartClientY;
                    if (Math.abs(deltaY) > 5) {
                        setIsDragging(true);
                    }
                    if (isDragging) {
                        setDragItemTop(dragItemStartTop + deltaY);
                        const overItemId = getDragItemIdUnderTarget(e, deltaYToTop);
                        if (overItemId) {
                            setDragOverItemId(overItemId);
                        }
                    }
                }
            }}
            onMouseUp={(e: React.MouseEvent<HTMLElement>) => {
                const id = getDragItemId(e.target);
                if (dragItemId) {
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
