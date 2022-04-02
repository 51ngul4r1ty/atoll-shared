// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintCard.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { buildSprintPointInfoText, formatDateRange, sprintStatusToString } from "./sprintCardUtils";
import { getBacklogItemElts, ItemMenuBuilderBacklogItem } from "./sprintCardJsxUtils";

// interfaces/types
import type { SprintCardProps, SprintCardSprint } from "./sprintCardTypes";

// consts/enums
import { EditMode } from "../../../common/componentEnums";
import { SpinnerAction } from "../../unique/smartSpinner/smartSpinnerEnums";
import { QUANTITY_UNKNOWN, TIME_UNKNOWN } from "../../unique/smartSpinner/smartSpinnerConsts";
import { SPINNER_METRIC_KEY_SPRINT_BACKLOG_ITEMS } from "../../unique/smartSpinner/spinnerMetrics";

// components
import { AddButton } from "../../buttons/AddButton";
import { ArchiveIcon } from "../../../atoms/icons/ArchiveIcon";
import { ItemDetailButton } from "../../buttons/ItemDetailButton";
import { SmartSpinner } from "../../unique/smartSpinner/SmartSpinner";
import { VerticalCollapseIcon } from "../../../atoms/icons/VerticalCollapseIcon";
import { VerticalExpandIcon } from "../../../atoms/icons/VerticalExpandIcon";

export type InnerSprintCardProps = SprintCardProps & WithTranslation;

/* exported components */

export const InnerSprintCard: React.FC<InnerSprintCardProps> = (props) => {
    const sprintDetailMenu =
        props.showDetailMenu && props.buildItemMenu ? props.buildItemMenu(props.id, props.showDetailMenuToLeft) : null;
    const sprintStatusElts = <div className={css.sprintStatus}>{sprintStatusToString(props.status)}</div>;
    const dateRangeArchiveStatusElts = props.archived ? <ArchiveIcon className={css.dateRangeArchiveIcon} /> : null;
    const sprintDateRangeElts = (
        <div className={css.sprintDateRange}>
            <div className={css.dateRangeText}>{formatDateRange(props.startDate, props.finishDate)}</div>
            <div className={css.sprintDateRangeArchiveStatus}>{dateRangeArchiveStatusElts}</div>
        </div>
    );
    const sprintHeaderRow2MobileElts = <div className={css.sprintHeaderRow2Mobile}>{sprintDateRangeElts}</div>;
    const buildSprintPointInfoTextElts = (sprint: SprintCardSprint, renderMobile: boolean) => {
        const text = buildSprintPointInfoText(sprint, renderMobile);
        if (!renderMobile || !text) {
            return text;
        } else {
            const parts = text.split("\n");
            const elts = [];
            let row = 0;
            parts.forEach((part) => {
                if (row) {
                    elts.push(
                        <div key={row} className={css.pointInfoBullet}>
                            {part}
                        </div>
                    );
                } else {
                    elts.push(
                        <div key={row} className={css.pointInfoHeading}>
                            {parts[0]}
                        </div>
                    );
                }
                row++;
            });
            return elts;
        }
    };
    const sprintHeaderContentInfoRowElts = (
        <div className={css.sprintHeaderContentInfoRow}>
            {buildSprintPointInfoTextElts(props as SprintCardSprint, props.renderMobile)}
        </div>
    );
    const onExpandCollapse = (id: string, expand: boolean) => {
        if (props.onExpandCollapse) {
            props.onExpandCollapse(id, expand);
        }
    };
    const expandCollapseIcon = props.expanded ? <VerticalCollapseIcon /> : <VerticalExpandIcon />;
    const contentsClassName = buildClassName(css.sprintContents, props.expanded ? css.expanded : null);
    const handleDetailClick = (itemId: string) => {
        if (props.onBacklogItemDetailClick) {
            props.onBacklogItemDetailClick(itemId);
        }
    };
    const handleBacklogItemIdClick = (id: string) => {
        if (props.onBacklogItemIdClick) {
            props.onBacklogItemIdClick(id);
        }
    };
    const itemMenuBuilderBacklogItems: ItemMenuBuilderBacklogItem[] = !props.backlogItems
        ? []
        : props.backlogItems.map((item) => ({
              ...item,
              hasPartsInNextSprint: true
          }));
    const sprintBacklogContents = props.backlogItemsLoaded ? (
        getBacklogItemElts(
            props.editMode,
            props.openedDetailMenuBacklogItemId,
            props.openingDetailMenuBacklogItemId,
            props.renderMobile || false,
            props.showDetailMenuToLeft,
            itemMenuBuilderBacklogItems,
            props.busySplittingStory,
            props.splitToNextSprintAvailable,
            handleDetailClick,
            handleBacklogItemIdClick,
            props.onMoveItemToBacklogClick,
            props.onSplitBacklogItemClick,
            props.onBacklogItemAcceptedClick,
            props.onBacklogItemDoneClick,
            props.onBacklogItemInProgressClick,
            props.onBacklogItemNotStartedClick,
            props.onBacklogItemReleasedClick
        )
    ) : (
        <SmartSpinner
            action={SpinnerAction.Loading}
            className={css.spinner}
            entityNameTemplate="sprint backlog `${plural('item','items')}`"
            expectedTime={TIME_UNKNOWN}
            metricEntityKey={props.id}
            metricKey={SPINNER_METRIC_KEY_SPRINT_BACKLOG_ITEMS}
            quantity={QUANTITY_UNKNOWN}
            showSpinnerImmediately
        />
    );
    const actionButtonElts =
        props.expanded && props.editMode === EditMode.Edit ? (
            <div className={css.sprintActionButtonPanel}>
                <AddButton
                    itemName={
                        props.selectedProductBacklogItemCount === 1 ? "1 item" : `${props.selectedProductBacklogItemCount} items`
                    }
                    disabled={!props.selectedProductBacklogItemCount || props.disableAddBacklogItemButton}
                    onClick={() => {
                        if (props.onAddBacklogItem) {
                            props.onAddBacklogItem();
                        }
                    }}
                />
            </div>
        ) : null;
    const classNameToUse = buildClassName(props.className, css.sprintCard);
    const sprintItemDetailMenuElts =
        props.editMode === EditMode.View ? null : (
            <div className={buildClassName(css.detailMenu, props.showDetailMenuToLeft ? css.menuToLeft : null)}>
                {sprintDetailMenu}
            </div>
        );
    const sprintArchivedStatusElts = props.archived ? <ArchiveIcon className={css.sprintNameArchiveIcon} /> : null;

    return (
        <div className={classNameToUse} tabIndex={0}>
            <div className={css.sprintHeaderAndContent}>
                <div className={css.sprintHeader}>
                    <div className={css.sprintName}>
                        {props.name}
                        {sprintArchivedStatusElts}
                    </div>
                    <div className={css.sprintHeaderContent}>
                        <div className={css.sprintHeaderContentTopRow}>
                            {props.renderMobile ? null : sprintDateRangeElts}
                            {sprintStatusElts}
                            <ItemDetailButton
                                itemId={props.id}
                                itemType="sprint"
                                hasDetails={props.editMode === EditMode.Edit}
                                className={css.detailButton}
                                onDetailClick={() => props.onSprintDetailClick()}
                            />
                        </div>
                        {props.renderMobile ? null : sprintHeaderContentInfoRowElts}
                    </div>
                </div>
                {props.renderMobile ? sprintHeaderRow2MobileElts : null}
                {props.renderMobile ? sprintHeaderContentInfoRowElts : null}
                <div className={contentsClassName}>{sprintBacklogContents}</div>
                {actionButtonElts}
            </div>
            <div
                className={css.expandCollapse}
                onClick={() => {
                    onExpandCollapse(props.id, !props.expanded);
                }}
            >
                {expandCollapseIcon}
            </div>
            {sprintItemDetailMenuElts}
        </div>
    );
};

export const SprintCard = withTranslation()(InnerSprintCard);
