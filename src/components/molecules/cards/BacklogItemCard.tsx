// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemCard.module.css";

// components
import { StoryIcon } from "../../atoms/icons/StoryIcon";
import { IssueIcon } from "../../atoms/icons/IssueIcon";
import { DragIcon } from "../../atoms/icons/DragIcon";
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { RemoveButton } from "../buttons/RemoveButton";
import { EditButton, EditMode } from "../buttons/EditButton";

// utils
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
    hasDetails?: boolean;
    isDraggable?: boolean;
    internalId: string;
    itemId: string;
    itemType: BacklogItemTypeEnum;
    marginBelowItem?: boolean;
    renderMobile?: boolean;
    titleText: string;
    offsetTop?: number;
    width?: any;
    showDetailMenu: boolean;
}

export interface BacklogItemCardDispatchProps {
    onDetailClicked?: { () };
    onEditItemClicked?: { (backlogItemId: string) };
    onRemoveItemClicked?: { (backlogItemId: string) };
}

export type BacklogItemCardProps = BacklogItemCardStateProps & BacklogItemCardDispatchProps & WithTranslation;

/* exported components */

export const InnerBacklogItemCard: React.FC<BacklogItemCardProps> = (props) => {
    const detailMenu = props.showDetailMenu ? (
        <ItemMenuPanel caretPosition={props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}>
            <RemoveButton
                suppressSpacing
                onClick={() => {
                    if (props.internalId && props.onRemoveItemClicked) {
                        props.onRemoveItemClicked(props.internalId);
                    }
                }}
            />
            <EditButton
                mode={EditMode.View}
                suppressSpacing
                onClick={() => {
                    if (props.internalId && props.onEditItemClicked) {
                        props.onEditItemClicked(props.internalId);
                    }
                }}
            />
        </ItemMenuPanel>
    ) : null;
    const outerClassNameToUse = buildClassName(css.backlogItemCardOuter, props.renderMobile ? css.mobile : null);
    const classNameToUse = buildClassName(
        css.backlogItemCard,
        props.marginBelowItem ? css.marginBelowItem : null,
        props.itemType === BacklogItemTypeEnum.None ? css.backlogItemGap : null,
        props.offsetTop ? css.dragging : null
    );
    const editDetailButton = props.hasDetails ? (
        <div
            className={css.backlogItemDetailButton}
            onClick={() => {
                if (props.onDetailClicked) {
                    props.onDetailClicked();
                }
            }}
        >
            <EditDetailIcon />
        </div>
    ) : null;
    const styleToUse: React.CSSProperties = props.offsetTop && { top: props.offsetTop, position: "absolute", zIndex: 10 };
    return (
        <div className={outerClassNameToUse} data-class="backlogitem" data-id={props.internalId} style={styleToUse}>
            <div className={classNameToUse} style={{ width: props.width }} tabIndex={0}>
                <div className={css.backlogItemType}>
                    <div className={css.backlogItemIcon}>
                        {props.itemType === BacklogItemTypeEnum.Story ? <StoryIcon invertColors /> : <IssueIcon invertColors />}
                    </div>
                    <div className={css.backlogItemId} title={titleForItemId(props.itemId)}>
                        {abbreviateId(props.itemId)}
                    </div>
                    {props.isDraggable && props.renderMobile ? (
                        <div data-class="drag-button" className={css.backlogItemDragButton}>
                            <DragIcon invertColors />
                        </div>
                    ) : null}
                </div>
                <div className={css.backlogItemText}>
                    {props.titleText}
                    {props.renderMobile ? editDetailButton : null}
                </div>
                <div className={css.backlogItemEstimate}>{formatEstimateForDisplay(props.estimate)}</div>
                {!props.renderMobile ? editDetailButton : null}
                {props.isDraggable && !props.renderMobile ? (
                    <div data-class="drag-button" className={css.backlogItemDragButton}>
                        <DragIcon />
                    </div>
                ) : null}
            </div>
            <div className={css.backlogItemCardDetailMenu}>{detailMenu}</div>
        </div>
    );
};

export const BacklogItemCard = withTranslation()(InnerBacklogItemCard);
