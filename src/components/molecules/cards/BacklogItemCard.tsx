// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemCard.module.css";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { Checkbox } from "../../atoms/inputs/Checkbox";
import { DragIcon } from "../../atoms/icons/DragIcon";
import { EditButton, EditMode } from "../buttons/EditButton";
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";
import { IssueIcon } from "../../atoms/icons/IssueIcon";
import { RemoveButton } from "../buttons/RemoveButton";
import { StoryIcon } from "../../atoms/icons/StoryIcon";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// consts/enums
import { PushState, SaveableBacklogItem } from "../../../reducers/backlogItems/backlogItemsReducerTypes";

/* exported functions */

export const buildUniqueItemKey = (props: SaveableBacklogItem, componentPrefix: string): string => {
    return props.id ? `${componentPrefix}-id-${props.id}` : `${componentPrefix}-i-${props.instanceId}`;
};

export const buildBacklogItemKey = (props: SaveableBacklogItem): string => {
    return buildUniqueItemKey(props, "bic");
};

export const buildBacklogItemPlanningItemKey = (props: SaveableBacklogItem): string => {
    return buildUniqueItemKey(props, "bipi");
};

export const buildDividerKey = (props: SaveableBacklogItem): string => {
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
    isSelectable?: boolean;
    hidden?: boolean;
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
    pushState?: PushState;
}

export interface BacklogItemCardDispatchProps {
    onDetailClicked?: { (): void };
    onEditItemClicked?: { (backlogItemId: string): void };
    onRemoveItemClicked?: { (backlogItemId: string): void };
    onCheckboxChange?: { (checked: boolean): void };
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
        props.offsetTop ? css.dragging : null,
        props.pushState === PushState.Changed ? css.pushStateChanged : null,
        props.pushState === PushState.Removed ? css.pushStateRemoved : null,
        props.hidden ? css.hidden : null
    );
    const editDetailButton = props.hasDetails ? (
        <div
            data-class="item-menu-button"
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
    const handleCheckboxChange = (checked: boolean) => {
        if (props.onCheckboxChange) {
            props.onCheckboxChange(checked);
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
    const styleToUse: React.CSSProperties = props.offsetTop && { top: props.offsetTop, position: "absolute", zIndex: 10 };
    return (
        <div className={outerClassNameToUse} data-class="backlogitem" data-id={props.internalId} style={styleToUse}>
            <div className={classNameToUse} style={{ width: props.width }} tabIndex={0}>
                <div className={css.backlogItemPushState}>
                    <div />
                </div>
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
                {!props.renderMobile ? checkboxToSelect : null}
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
                {mobileCheckboxElts}
            </div>
            <div className={css.backlogItemCardDetailMenu}>{detailMenu}</div>
        </div>
    );
};

export const BacklogItemCard = withTranslation()(InnerBacklogItemCard);
