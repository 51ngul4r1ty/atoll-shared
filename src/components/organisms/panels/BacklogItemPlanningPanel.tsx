// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import { AddButton } from "../../molecules/buttons/AddButton";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";

// consts/enums
import { EditMode } from "../../molecules/buttons/EditButton";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { buildClassName } from "../../../utils/classNameBuilder";
import { useDispatch, useSelector } from "react-redux";
import { BacklogItemType } from "../../../reducers/backlogItemsReducer";

// actions
import { updateBacklogItemFields, cancelUnsavedBacklogItem, saveBacklogItem } from "../../../actions/backlogItems";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";

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
    addedBacklogItems: PlanningPanelBacklogItem[];
    backlogItems: PlanningPanelBacklogItem[];
    highlightedDividers: number[];
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

const buildCommonBacklogItemElts = (
    editMode: EditMode,
    backlogItems: PlanningPanelBacklogItem[],
    renderMobile: boolean,
    addedItems: boolean,
    sortedHighlightedDividers: number[]
) => {
    const dispatch = useDispatch();
    let currentHighlightedDividerIdx = 0;
    let lastDisplayIndex: number = null;
    return backlogItems.map((item: PlanningPanelBacklogItem) => {
        const currentHighlightedDivider = sortedHighlightedDividers[currentHighlightedDividerIdx];

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
            console.log(`CURRENT DIVIDER = ${currentHighlightedDivider}, idx = ${currentHighlightedDividerIdx}`);
            let highlighted: boolean;
            if (lastDisplayIndex === null) {
                // highlighted = currentHighlightedDivider < item.displayIndex;
                console.log("top logic");
            } else {
                // highlighted = lastDisplayIndex < currentHighlightedDivider && currentHighlightedDivider < item.displayIndex;
                console.log("bottom logic");
            }
            highlighted = false;
            //            console.log(`HIGHLIGHTED = ${highlighted} - ${lastDisplayIndex} vs ${item.displayIndex}`);
            if (highlighted) {
                currentHighlightedDividerIdx++;
            }
            //            lastDisplayIndex = item.displayIndex;
            return (
                <>
                    <SimpleDivider key={`divider-${item.id}`} highlighted={highlighted} />
                    <BacklogItemCard
                        key={item.id}
                        estimate={item.estimate}
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
    });
};

const buildAddedBacklogItemElts = (
    editMode: EditMode,
    backlogItems: PlanningPanelBacklogItem[],
    renderMobile: boolean,
    sortedHighlightedDividers: number[]
) => {
    return buildCommonBacklogItemElts(editMode, backlogItems, renderMobile, true, sortedHighlightedDividers);
};

const buildBacklogItemElts = (
    editMode: EditMode,
    backlogItems: PlanningPanelBacklogItem[],
    renderMobile: boolean,
    sortedHighlightedDividers: number[]
) => {
    return buildCommonBacklogItemElts(editMode, backlogItems, renderMobile, false, sortedHighlightedDividers);
};

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const sortedHighlightedDividers = props.highlightedDividers.sort((a, b) => b - a);
    let count = 0;
    sortedHighlightedDividers.forEach((item) => {
        console.log(`ITEM ${++count}: ${item}`);
    });
    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
    const addedBacklogItemElts = buildAddedBacklogItemElts(props.editMode, props.addedBacklogItems, props.renderMobile, []);
    // let firstDisplayIndex: number;
    // if (props.addedBacklogItems.length) {
    //     const lastAddedBacklogItem = props.addedBacklogItems[props.addedBacklogItems.length - 1];
    //     firstDisplayIndex = lastAddedBacklogItem.displayIndex;
    // }
    const backlogItemElts = buildBacklogItemElts(props.editMode, props.backlogItems, props.renderMobile, sortedHighlightedDividers);
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
    const addedBacklogItemEltsDivider = addedBacklogItemElts.length ? <SimpleDivider /> : null;
    const backlogItemEltsDivider = backlogItemElts.length ? <SimpleDivider /> : null;

    return (
        <div className={classNameToUse}>
            {addedBacklogItemElts}
            {addedBacklogItemEltsDivider}
            {actionButtons}
            {backlogItemElts}
            {backlogItemEltsDivider}
        </div>
    );
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
