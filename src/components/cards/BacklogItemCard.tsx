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
    estimate: number | null;
    itemId: string;
    itemType: BacklogItemTypeEnum;
    titleText: string;
}

export interface BacklogItemCardEventProps {}

export type BacklogItemCardProps = BacklogItemCardAttributeProps & BacklogItemCardEventProps & WithTranslation;

/* exported components */

export const abbreviateId = (id: string): string => {
    if (!id) {
        return id;
    }
    if (id.length <= 5) {
        return id;
    }
    const prefix = id.substr(0, 1);
    const suffix = id.substr(id.length - 3, 3);
    return `${prefix}..${suffix}`;
};

export const formatEstimateForDisplay = (estimate: number | null): string => {
    return estimate ? `${estimate}` : "-";
};

export const titleForItemId = (id: string): string | undefined => {
    const abbreviatedId = abbreviateId(id);
    return abbreviatedId === id ? undefined : id;
};

export const RawBacklogItemCard: React.FC<BacklogItemCardProps> = (props) => (
    <div className={css.backlogItemCard} tabIndex={0}>
        <div className={css.backlogItemType}>
            <div className={css.backlogItemIcon}>
                {props.itemType === BacklogItemTypeEnum.Story ? <StoryIcon /> : <IssueIcon />}
            </div>
            <div className={css.backlogItemId} title={titleForItemId(props.itemId)}>
                {abbreviateId(props.itemId)}
            </div>
        </div>
        <div className={css.backlogItemText}>{props.titleText}</div>
        <div className={css.backlogItemEstimate}>{formatEstimateForDisplay(props.estimate)}</div>
    </div>
);

export const BacklogItemCard = withTranslation()(RawBacklogItemCard);
