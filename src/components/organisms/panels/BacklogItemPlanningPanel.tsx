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

/* exported interfaces */

export interface BacklogItem {
    estimate: number | null;
    externalId: string;
    id: number;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
    type: BacklogItemType;
}

export interface BacklogItemPlanningPanelStateProps {
    backlogItems: BacklogItem[];
    editMode: EditMode;
}

export interface BacklogItemPlanningPanelDispatchProps {}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

/* exported components */

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const backlogItemElts = props.backlogItems.map((item: BacklogItem) => (
        <BacklogItemCard
            key={item.id}
            estimate={item.estimate}
            itemId={`${item.externalId}`}
            itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
            titleText={item.storyPhrase}
            isDraggable={props.editMode === EditMode.Edit}
        />
    ));

    const actionButtons =
        props.editMode === EditMode.View ? null : (
            <div className={css.backlogItemPlanningActionPanel}>
                <AddButton itemName="story" onClick={() => {}} />
                <AddButton itemName="issue" onClick={() => {}} />
            </div>
        );
    return (
        <div className={css.backlogItemPlanningPanel}>
            {actionButtons}
            {backlogItemElts}
        </div>
    );
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
