// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// components
import css from "./BacklogItemCard.module.css";
import { StoryIcon } from "../../atoms/icons/StoryIcon";
import { IssueIcon } from "../../atoms/icons/IssueIcon";
import { DragIcon } from "../../atoms/icons/DragIcon";
import { buildClassName } from "../../../utils/classNameBuilder";

/* exported functions */

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

/* exported interfaces */

// TODO: See if this is defined elsewhere:
export enum BacklogItemTypeEnum {
    None,
    Bug,
    Story
}

export interface BacklogItemCardStateProps {
    estimate: number | null;
    isDraggable?: boolean;
    internalId: string;
    itemId: string;
    itemType: BacklogItemTypeEnum;
    marginBelowItem?: boolean;
    renderMobile?: boolean;
    titleText: string;
    top?: string;
    width?: any;
}

export interface BacklogItemCardDispatchProps {
    // onDragStart?: { (itemId: string) };
    // onDragMove?: { (itemId: string, deltaY: number) };
    // onDragEnd?: { (itemId: string) };
}

export type BacklogItemCardProps = BacklogItemCardStateProps & BacklogItemCardDispatchProps & WithTranslation;

/* exported components */

export const RawBacklogItemCard: React.FC<BacklogItemCardProps> = (props) => {
    const classNameToUse = buildClassName(
        css.backlogItemCard,
        props.renderMobile ? css.mobile : null,
        props.marginBelowItem ? css.marginBelowItem : null,
        props.itemType === BacklogItemTypeEnum.None ? css.backlogItemGap : null,
        props.top ? css.dragging : null
    );
    return (
        <div
            data-class="backlogitem"
            data-id={props.internalId}
            className={classNameToUse}
            tabIndex={0}
            style={{ top: props.top, width: props.width }}
        >
            <div className={css.backlogItemType}>
                <div className={css.backlogItemIcon}>
                    {props.itemType === BacklogItemTypeEnum.Story ? <StoryIcon invertColors /> : <IssueIcon invertColors />}
                </div>
                <div className={css.backlogItemId} title={titleForItemId(props.itemId)}>
                    {abbreviateId(props.itemId)}
                </div>
            </div>
            <div className={css.backlogItemText}>{props.titleText}</div>
            <div className={css.backlogItemEstimate}>{formatEstimateForDisplay(props.estimate)}</div>
            {props.isDraggable ? (
                <div
                    className={css.backlogItemDragButton}
                    // onMouseDown={() => {
                    //     props.onDragStart && props.onDragStart(props.itemId);
                    // }}
                    // onMouseUp={() => {
                    //     props.onDragEnd && props.onDragEnd(props.itemId);
                    // }}
                >
                    <DragIcon />
                </div>
            ) : null}
        </div>
    );
};

export const BacklogItemCard = withTranslation()(RawBacklogItemCard);
