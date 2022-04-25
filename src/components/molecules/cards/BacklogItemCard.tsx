// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemCard.module.css";

// components
import { Checkbox } from "../../atoms/inputs/Checkbox";
import { DragIcon } from "../../atoms/icons/DragIcon";
import { IssueIcon } from "../../atoms/icons/IssueIcon";
import { StoryIcon } from "../../atoms/icons/StoryIcon";
import { ItemDetailButton } from "../buttons/ItemDetailButton";
import { StatusAcceptedIcon, StatusDoneIcon, StatusInProgressIcon, StatusReleasedIcon } from "../../atoms/icons";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import type { BacklogItem } from "../../../types/backlogItemTypes";
import type { ItemMenuBuilder } from "../menus/menuBuilderTypes";

// consts/enums
import { PushState } from "../../../reducers/enums";
import { BacklogItemStatus } from "../../../types/backlogItemEnums";

//#region exported functions

export const buildUniqueItemKey = (props: BacklogItem, componentPrefix: string): string => {
    return props.id ? `${componentPrefix}-id-${props.id}` : `${componentPrefix}-i-${props.instanceId}`;
};

export const buildBacklogItemKey = (props: BacklogItem): string => {
    return buildUniqueItemKey(props, "bic");
};

export const buildBacklogItemPlanningItemKey = (props: BacklogItem): string => {
    return buildUniqueItemKey(props, "bipi");
};

export const buildDividerKey = (props: BacklogItem): string => {
    return buildUniqueItemKey(props, "div-l");
};

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

export const formatNumberForDisplay = (val: number | null): string => {
    return val ? `${val}` : "-";
};

export const getFractionElts = (topVal: number, bottomVal: number) => {
    return (
        <>
            <div className={css.fractionTop}>{topVal}</div>
            <div className={css.fractionSlash}>/</div>
            <div className={css.fractionBottom}>{bottomVal}</div>
        </>
    );
};

export const getEstimateElts = (estimate: number | null) => {
    if (estimate >= 0.24 && estimate <= 0.26) {
        return getFractionElts(1, 4);
    } else if (estimate >= 0.49 && estimate <= 0.51) {
        return getFractionElts(1, 2);
    } else {
        return formatNumberForDisplay(estimate);
    }
};

export const titleForItemId = (id: string): string | undefined => {
    const abbreviatedId = abbreviateId(id);
    return abbreviatedId === id ? undefined : id;
};

export const fullStoryText = (rolePhrase: string, storyPhrase: string, reasonPhrase: string) => {
    if (!rolePhrase && !reasonPhrase) {
        return storyPhrase;
    } else if (!reasonPhrase) {
        return `${rolePhrase}, ${storyPhrase}`;
    } else if (!rolePhrase) {
        return `${storyPhrase}, ${reasonPhrase}`;
    } else {
        return `${rolePhrase}, ${storyPhrase}, ${reasonPhrase}`;
    }
};

//#endregion

//#region exported interfaces/types

// TODO: See if this is defined elsewhere:
export enum BacklogItemTypeEnum {
    None,
    Bug,
    Story
}

export interface BacklogItemCardStateProps {
    buildItemMenu?: ItemMenuBuilder;
    cardType?: BacklogItemCardType;
    estimate: number | null;
    hasDetails?: boolean;
    hidden?: boolean;
    internalId: string;
    isDraggable?: boolean;
    isLoadingDetails?: boolean;
    isSelectable?: boolean;
    itemId: string;
    itemType: BacklogItemTypeEnum;
    marginBelowItem?: boolean;
    offsetTop?: number;
    partIndex?: number;
    pushState?: PushState;
    reasonText: string;
    renderMobile?: boolean;
    roleText: string;
    showDetailMenu: boolean;
    showDetailMenuToLeft?: boolean;
    status?: BacklogItemStatus;
    storyEstimate?: number | null;
    titleText: string;
    totalParts?: number;
    unallocatedParts?: number;
    width?: any;
}

export interface BacklogItemCardDispatchProps {
    onDetailClick?: { (): void };
    onEditItemClick?: { (backlogItemId: string): void };
    onRemoveItemClick?: { (backlogItemId: string): void };
    onCheckboxChange?: { (checked: boolean): void };
    onBacklogItemIdClick?: { (backlogItemId: string): void };
}

export type BacklogItemCardProps = BacklogItemCardStateProps & BacklogItemCardDispatchProps;

export type InnerBacklogItemCardProps = BacklogItemCardProps & WithTranslation;

export enum BacklogItemCardType {
    ProductBacklogCard,
    SprintBacklogCard
}

//#endregion

/* exported components */

export const InnerBacklogItemCard: React.FC<InnerBacklogItemCardProps> = (props) => {
    const detailMenu = props.showDetailMenu ? props.buildItemMenu(props.internalId, props.showDetailMenuToLeft) : null;
    const classNameToUse = buildClassName(
        css.backlogItemCard,
        props.marginBelowItem ? css.marginBelowItem : null,
        props.itemType === BacklogItemTypeEnum.None ? css.backlogItemGap : null,
        props.offsetTop ? css.dragging : null,
        props.pushState === PushState.Changed ? css.pushStateChanged : null,
        props.pushState === PushState.Removed ? css.pushStateRemoved : null,
        props.hidden ? css.hidden : null
    );
    const editDetailButton = (
        <ItemDetailButton
            itemId={props.internalId}
            itemType="backlog-item"
            hasDetails={props.hasDetails}
            isLoading={props.isLoadingDetails}
            className={css.backlogItemDetailButton}
            onDetailClick={() => props.onDetailClick()}
        />
    );
    const handleCheckboxChange = (checked: boolean) => {
        if (props.onCheckboxChange) {
            props.onCheckboxChange(checked);
        }
    };
    const handleBacklogItemIdClick = (id: string) => {
        if (props.onBacklogItemIdClick) {
            props.onBacklogItemIdClick(id);
        }
    };
    const checkboxToSelect = props.isSelectable ? (
        <Checkbox
            className={css.checkbox}
            inputId={`backlogCheckbox_${props.itemId}`}
            labelText=""
            onChange={(checked: boolean) => handleCheckboxChange(checked)}
        />
    ) : null;
    const mobileCheckboxElts = props.renderMobile ? <div className={css.mobileCheckbox}>{checkboxToSelect}</div> : null;
    const styleToUse: React.CSSProperties = props.offsetTop
        ? { top: props.offsetTop, position: "absolute", zIndex: 10 }
        : undefined;
    let statusIcon: React.ReactElement;
    let hoverText: string;
    let ariaLabel: string;
    switch (props.status) {
        case BacklogItemStatus.InProgress: {
            statusIcon = <StatusInProgressIcon />;
            hoverText = "in progress";
            ariaLabel = "work item is in progress";
            break;
        }
        case BacklogItemStatus.Done: {
            statusIcon = <StatusDoneIcon />;
            hoverText = "done";
            ariaLabel = "work item meets definition of done";
            break;
        }
        case BacklogItemStatus.Accepted: {
            statusIcon = <StatusAcceptedIcon />;
            hoverText = "accepted";
            ariaLabel = "work item has been accepted";
            break;
        }
        case BacklogItemStatus.Released: {
            hoverText = "released";
            ariaLabel = "work item has been released";
            statusIcon = <StatusReleasedIcon />;
            break;
        }
    }
    const statusIconElts =
        statusIcon !== null ? (
            <div className={css.status} title={hoverText} aria-label={ariaLabel}>
                {statusIcon}
            </div>
        ) : null;
    const isSplitBacklogItem = props.totalParts > 1;
    const splitTextContent =
        props.cardType === BacklogItemCardType.ProductBacklogCard
            ? `${props.unallocatedParts} of ${props.totalParts} unallocated splits`
            : `Split ${props.partIndex} of ${props.totalParts}`;
    const splitTextElts = (
        <div className={css.backlogItemSplitText} title={splitTextContent}>
            {splitTextContent}
        </div>
    );
    const storyPointsElts = getEstimateElts(props.estimate);
    const totalPointsElts = props.storyEstimate ? getEstimateElts(props.storyEstimate) : null;
    const showSplitEstimate = props.partIndex > 1 || props.cardType === BacklogItemCardType.ProductBacklogCard;
    const splitBoxElts = showSplitEstimate ? (
        <>
            <div className={css.splitStoryPoints}>{storyPointsElts}</div>
            <div className={css.splitBottomWedge} />
            <div className={css.splitTotalPoints}>{totalPointsElts}</div>
        </>
    ) : (
        storyPointsElts
    );
    const estimateElts = isSplitBacklogItem ? splitBoxElts : storyPointsElts;
    const estimateEltsContainerClass = buildClassName(
        css.backlogItemEstimate,
        isSplitBacklogItem && props.partIndex === 1 ? css.splitPartOne : null
    );
    return (
        <div className={css.backlogItemCardOuter} data-class="backlogitem" data-id={props.internalId} style={styleToUse}>
            <div className={classNameToUse} style={{ width: props.width }} tabIndex={0}>
                <div className={css.backlogItemPushState}>
                    <div />
                </div>
                <div className={css.backlogItemType}>
                    <div className={css.backlogItemIcon}>
                        {props.itemType === BacklogItemTypeEnum.Story ? <StoryIcon invertColors /> : <IssueIcon invertColors />}
                    </div>
                    <div
                        className={css.backlogItemId}
                        title={titleForItemId(props.itemId)}
                        onClick={() => handleBacklogItemIdClick(props.internalId)}
                    >
                        {abbreviateId(props.itemId)}
                    </div>
                    {props.isDraggable && props.renderMobile ? (
                        <div data-class="drag-button" className={css.backlogItemDragButton}>
                            <DragIcon invertColors />
                        </div>
                    ) : null}
                </div>
                {!props.renderMobile ? checkboxToSelect : null}
                <div className={css.backlogItemText}>
                    <div className={css.backlogItemTextContent}>
                        <div
                            className={css.backlogItemTextTitleText}
                            title={fullStoryText(props.roleText, props.titleText, props.reasonText)}
                        >
                            {props.titleText}
                        </div>
                        {props.renderMobile ? statusIconElts : null}
                        {props.renderMobile ? editDetailButton : null}
                    </div>
                    {isSplitBacklogItem ? splitTextElts : null}
                </div>
                <div className={estimateEltsContainerClass}>{estimateElts}</div>
                {!props.renderMobile ? statusIconElts : null}
                {!props.renderMobile ? editDetailButton : null}
                {props.isDraggable && !props.renderMobile ? (
                    <div data-class="drag-button" className={css.backlogItemDragButton}>
                        <DragIcon />
                    </div>
                ) : null}
                {mobileCheckboxElts}
            </div>
            <div className={buildClassName(css.backlogItemCardDetailMenu, props.showDetailMenuToLeft ? css.menuToLeft : null)}>
                {detailMenu}
            </div>
        </div>
    );
};

export const BacklogItemCard = withTranslation()(InnerBacklogItemCard);
