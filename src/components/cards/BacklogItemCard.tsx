// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// components
import css from "./BacklogItemCard.module.css";
import { StoryIcon } from "../images/StoryIcon";
import { IssueIcon } from "../images/IssueIcon";

/* exported interfaces */

// TODO: See if this is defined elsewhere:
export enum BacklogItemTypeEnum {
    Bug,
    Story
}

export interface BacklogItemCardAttributeProps {
    itemId: string;
    itemType: BacklogItemTypeEnum;
    titleText: string;
}

export interface BacklogItemCardEventProps {}

export type BacklogItemCardProps = BacklogItemCardAttributeProps & BacklogItemCardEventProps & WithTranslation;

/* exported components */

export const RawBacklogItemCard: React.FC<BacklogItemCardProps> = (props) => (
    <div className={css.backlogItemCard}>
        <div className={css.backlogItemType}>
            <div className={css.backlogItemIcon}>
                {props.itemType === BacklogItemTypeEnum.Story ? <StoryIcon /> : <IssueIcon />}
            </div>
            <div className={css.backlogItemId}>{props.itemId}</div>
        </div>
        <div className={css.backlogItemText}>{props.titleText}</div>
    </div>
);

export const BacklogItemCard = withTranslation()(RawBacklogItemCard);
