// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import { AddButton } from "../../molecules/buttons/AddButton";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { BacklogItemType } from "../../../types";

// consts/enums
import { EditMode } from "../../molecules/buttons/EditButton";
import { UserStoryDetailForm } from "../forms/UserStoryDetailForm";
import { buildClassName } from "../../../utils/classNameBuilder";

/* exported interfaces */

export interface PlanningPanelBacklogItem {
    estimate: number | null;
    externalId: string;
    id: number;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
    type: BacklogItemType;
    editing: boolean;
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
    return backlogItems.map((item: PlanningPanelBacklogItem) => {
        if (item.editing) {
            return (
                <UserStoryDetailForm
                    className={css.backlogItemUserStoryFormRow}
                    externalId={item.externalId}
                    editing
                    estimate={item.estimate}
                    rolePhrase={item.rolePhrase}
                    storyPhrase={item.storyPhrase}
                    reasonPhrase={item.reasonPhrase}
                    type={item.type}
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
