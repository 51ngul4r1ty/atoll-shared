// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintCard.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { buildSprintPointInfoText, formatDateRange, sprintStatusToString } from "./sprintCardUtils";
import { getBacklogItemElts } from "./sprintCardJsxUtils";

// interfaces/types
import { SprintPlanningPanelSprint } from "./sprintCardTypes";

// consts/enums
import { EditMode } from "../../buttons/EditButton";

// components
import { VerticalCollapseIcon } from "../../../atoms/icons/VerticalCollapseIcon";
import { VerticalExpandIcon } from "../../../atoms/icons/VerticalExpandIcon";
import { AddButton } from "../../buttons/AddButton";

export interface SprintCardStateProps extends SprintPlanningPanelSprint {
    className?: string;
    editMode: EditMode;
    openedDetailMenuBacklogItemId: string;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
}

export interface SprintCardDispatchProps {
    onAddBacklogItem: { (): void };
    onExpandCollapse: { (id: string, expand: boolean): void };
    onDetailClicked: { (id: string) };
    onMoveItemToBacklogClicked: { (id: string) };
}

export type SprintCardProps = SprintCardStateProps & SprintCardDispatchProps;

export type InnerSprintCardProps = SprintCardProps & WithTranslation;

/* exported components */

export const InnerSprintCard: React.FC<InnerSprintCardProps> = (props) => {
    const sprintStatusElts = <div className={css.sprintStatus}>{sprintStatusToString(props.status)}</div>;
    const sprintDateRangeElts = <div className={css.sprintDateRange}>{formatDateRange(props.startDate, props.finishDate)}</div>;
    const sprintHeaderRow2MobileElts = <div className={css.sprintHeaderRow2Mobile}>{sprintDateRangeElts}</div>;
    const buildSprintPointInfoTextElts = (sprint: SprintPlanningPanelSprint, renderMobile: boolean) => {
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
            {buildSprintPointInfoTextElts(props as SprintPlanningPanelSprint, props.renderMobile)}
        </div>
    );
    const onExpandCollapse = (id: string, expand: boolean) => {
        if (props.onExpandCollapse) {
            props.onExpandCollapse(id, expand);
        }
    };
    const expandCollapseIcon = props.expanded ? <VerticalCollapseIcon /> : <VerticalExpandIcon />;
    const contentsClassName = buildClassName(css.sprintContents, props.expanded ? css.expanded : null);
    const handleDetailClicked = (itemId: string) => {
        if (props.onDetailClicked) {
            props.onDetailClicked(itemId);
        }
    };
    const sprintBacklogContents = props.backlogItemsLoaded
        ? getBacklogItemElts(
              props.editMode,
              props.openedDetailMenuBacklogItemId,
              props.renderMobile || false,
              props.backlogItems,
              handleDetailClicked,
              props.onMoveItemToBacklogClicked
          )
        : "[ loading... ]";
    const actionButtonElts =
        props.expanded && props.editMode === EditMode.Edit ? (
            <div className={css.sprintActionButtonPanel}>
                <AddButton
                    itemName={
                        props.selectedProductBacklogItemCount === 1 ? "1 item" : `${props.selectedProductBacklogItemCount} items`
                    }
                    disabled={!props.selectedProductBacklogItemCount}
                    onClick={() => {
                        if (props.onAddBacklogItem) {
                            props.onAddBacklogItem();
                        }
                    }}
                />
            </div>
        ) : null;
    const classNameToUse = buildClassName(props.className, css.sprintCard);
    return (
        <div className={classNameToUse} tabIndex={0}>
            <div className={css.sprintHeaderAndContent}>
                <div className={css.sprintHeader}>
                    <div className={css.sprintName}>{props.name}</div>
                    <div className={css.sprintHeaderContent}>
                        <div className={css.sprintHeaderContentTopRow}>
                            {props.renderMobile ? null : sprintDateRangeElts}
                            {sprintStatusElts}
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
        </div>
    );
};

export const SprintCard = withTranslation()(InnerSprintCard);
