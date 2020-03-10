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

/* exported interfaces */

export interface PlanningPanelBacklogItem {
    estimate: number | null;
    externalId: string;
    id: number;
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

const buildBacklogItemElts = (editMode: EditMode, backlogItems: PlanningPanelBacklogItem[], renderMobile: boolean) => {
    const dispatch = useDispatch();
    return backlogItems.map((item: PlanningPanelBacklogItem) => {
        if (!item.saved) {
            return (
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
            );
        } else {
            return (
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
            );
        }
    });
};

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
    const addedBacklogItemElts = buildBacklogItemElts(props.editMode, props.addedBacklogItems, props.renderMobile);
    const backlogItemElts = buildBacklogItemElts(props.editMode, props.backlogItems, props.renderMobile);
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
    return (
        <div className={classNameToUse}>
            {addedBacklogItemElts}
            {actionButtons}
            {backlogItemElts}
        </div>
    );
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
