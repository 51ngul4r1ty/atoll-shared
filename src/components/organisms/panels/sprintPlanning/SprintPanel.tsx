// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintPanel.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { buildSprintPointInfoText, formatDateRange, sprintStatusToString } from "./sprintPlanningPanelUtils";

// components
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// interfaces/types
import { SprintPlanningPanelSprint } from "./sprintPlanningPanelTypes";
import { VerticalExpandIcon } from "../../../atoms/icons/VerticalExpandIcon";
import { VerticalCollapseIcon } from "../../../atoms/icons/VerticalCollapseIcon";
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";
import { BacklogItemCard, BacklogItemTypeEnum, buildBacklogItemKey } from "../../../molecules/cards/BacklogItemCard";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";
import { AddButton } from "../../../molecules/buttons/AddButton";

export interface SprintPanelStateProps extends SprintPlanningPanelSprint {
    editMode: EditMode;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
}

export interface SprintPanelDispatchProps {
    onAddBacklogItem: { (): void };
    onExpandCollapse: { (id: string, expand: boolean): void };
}

export type SprintPanelProps = SprintPanelStateProps & SprintPanelDispatchProps & WithTranslation;

export const getBacklogItemElts = (editMode: EditMode, renderMobile: boolean, backlogItems: SprintBacklogItem[]) => {
    return backlogItems.map((backlogItem) => (
        <div key={backlogItem.id}>
            <BacklogItemCard
                key={buildBacklogItemKey(backlogItem)}
                estimate={backlogItem.estimate}
                internalId={`${backlogItem.id}`}
                itemId={`${backlogItem.externalId}`}
                itemType={backlogItem.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                titleText={backlogItem.storyPhrase}
                isDraggable={false}
                hasDetails={editMode === EditMode.Edit}
                renderMobile={renderMobile}
                marginBelowItem
                showDetailMenu={false}
            />
        </div>
    ));
};

export const InnerSprintPanel: React.FC<SprintPanelProps> = (props) => {
    const onExpandCollapse = (id: string, expand: boolean) => {
        if (props.onExpandCollapse) {
            props.onExpandCollapse(id, expand);
        }
    };
    const expandCollapseIcon = props.expanded ? <VerticalCollapseIcon /> : <VerticalExpandIcon />;
    const contentsClassName = buildClassName(css.sprintContents, props.expanded ? css.expanded : null);
    const sprintBacklogContents = props.backlogItemsLoaded
        ? getBacklogItemElts(props.editMode, props.renderMobile || false, props.backlogItems)
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
    const sprintStatusElts = <div className={css.sprintStatus}>{sprintStatusToString(props.status)}</div>;
    const sprintDateRangeElts = <div className={css.sprintDateRange}>{formatDateRange(props.startDate, props.finishDate)}</div>;
    const sprintHeaderRow2MobileElts = <div className={css.sprintHeaderRow2Mobile}>{sprintDateRangeElts}</div>;
    const sprintHeaderContentInfoRowElts = (
        <div className={css.sprintHeaderContentInfoRow}>
            {buildSprintPointInfoTextElts(props as SprintPlanningPanelSprint, props.renderMobile)}
        </div>
    );

    return (
        <>
            <SimpleDivider />
            <div className={css.sprintPanel} tabIndex={0}>
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
        </>
    );
};

export const SprintPanel = withTranslation()(InnerSprintPanel);
