// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// components
import css from "./BacklogItemPlanningPanel.module.css";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { BacklogItemType } from "../../../types";

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

export interface BacklogItemPlanningPanelAttributeProps {
    backlogItems: BacklogItem[];
}

export interface BacklogItemPlanningPanelEventProps {}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelAttributeProps &
    BacklogItemPlanningPanelEventProps &
    WithTranslation;

/* exported components */

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const backlogItemElts = props.backlogItems.map((item) => (
        <BacklogItemCard
            estimate={item.estimate}
            itemId={`${item.externalId}`}
            itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
            titleText={item.storyPhrase}
        />
    ));

    return <div className={css.backlogItemPlanningPanel}>{backlogItemElts}</div>;
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
