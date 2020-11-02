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
import { AddButton } from "../../../molecules/buttons/AddButton";

// interfaces/types
import { BacklogItemCard, ItemMenuEventHandlers } from "../../../molecules/cards/BacklogItemCard";
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";
import { SprintPlanningPanelSprint } from "./sprintPlanningPanelTypes";
import { VerticalCollapseIcon } from "../../../atoms/icons/VerticalCollapseIcon";
import { VerticalExpandIcon } from "../../../atoms/icons/VerticalExpandIcon";

// utils
import { buildBacklogItemKey, calcItemId } from "../../../molecules/cards/BacklogItemCard";
import { sprintBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";

// consts/enums
import { BacklogItemTypeEnum } from "../../../molecules/cards/BacklogItemCard";
import { EditMode } from "../../../molecules/buttons/EditButton";

export interface SprintPanelStateProps extends SprintPlanningPanelSprint {
    editMode: EditMode;
    openedDetailMenuBacklogItemId: string;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
}

export interface SprintPanelDispatchProps {
    onAddBacklogItem: { (): void };
    onExpandCollapse: { (id: string, expand: boolean): void };
    onDetailClicked: { (id: string) };
    onMoveItemToBacklogClicked: { (id: string) };
}

export type SprintPanelProps = SprintPanelStateProps & SprintPanelDispatchProps & WithTranslation;

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    backlogItems: SprintBacklogItem[],
    onDetailClicked: { (backlogItemId: string) },
    onMoveItemToBacklogClicked: { (itemId: string) }
) => {
    const eventHandlers: ItemMenuEventHandlers = {
        handleEvent: (eventName: string, itemId: string) => {
            if (eventName === "onMoveItemToBacklogClicked") {
                onMoveItemToBacklogClicked(itemId);
            } else {
                throw Error(`${eventName} is not handled`);
            }
        }
    };
    return backlogItems.map((backlogItem) => (
        <div key={backlogItem.id}>
            <BacklogItemCard
                key={buildBacklogItemKey(backlogItem)}
                buildItemMenu={sprintBacklogItemMenuBuilder(eventHandlers)}
                estimate={backlogItem.estimate}
                internalId={`${backlogItem.id}`}
                itemId={calcItemId(backlogItem.externalId, backlogItem.friendlyId)}
                itemType={backlogItem.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                titleText={backlogItem.storyPhrase}
                isDraggable={false}
                hasDetails={editMode === EditMode.Edit}
                renderMobile={renderMobile}
                marginBelowItem
                showDetailMenu={backlogItem.id === openedDetailMenuBacklogItemId}
                showDetailMenuToLeft
                onDetailClicked={() => {
                    onDetailClicked(backlogItem.id);
                }}
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
