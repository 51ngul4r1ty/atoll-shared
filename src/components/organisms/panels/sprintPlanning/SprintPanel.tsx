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
import { EditMode } from "../../../molecules/buttons/EditButton";

export interface SprintPanelStateProps extends SprintPlanningPanelSprint {}

export interface SprintPanelDispatchProps {
    onExpandCollapse: { (id: string, expand: boolean): void };
}

export type SprintPanelProps = SprintPanelStateProps & SprintPanelDispatchProps & WithTranslation;

export const getBacklogItemElts = (backlogItems: SprintBacklogItem[]) => {
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
                hasDetails={false}
                renderMobile={false}
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
    const sprintBacklogContents = props.backlogItemsLoaded ? getBacklogItemElts(props.backlogItems) : "[ loading... ]";
    return (
        <>
            <SimpleDivider />
            <div className={css.sprintPanel} tabIndex={0}>
                <div className={css.sprintHeaderAndContent}>
                    <div className={css.sprintHeader}>
                        <div className={css.sprintName}>{props.name}</div>
                        <div className={css.sprintHeaderContent}>
                            <div className={css.sprintHeaderContentTopRow}>
                                <div className={css.sprintDateRange}>{formatDateRange(props.startDate, props.finishDate)}</div>
                                <div className={css.sprintStatus}>{sprintStatusToString(props.status)}</div>
                            </div>
                            <div className={css.sprintHeaderContentInfoRow}>{buildSprintPointInfoText(props)}</div>
                        </div>
                    </div>
                    <div className={contentsClassName}>{sprintBacklogContents}</div>
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
