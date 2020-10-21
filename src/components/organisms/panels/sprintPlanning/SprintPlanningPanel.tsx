// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintPlanningPanel.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { buildSprintPointInfoText, formatDateRange, sprintStatusToString } from "./sprintPlanningPanelUtils";

// components
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// interfaces/types
import { SprintPlanningPanelSprint } from "./sprintPlanningPanelTypes";
import { VerticalExpandIcon } from "../../../atoms/icons/VerticalExpandIcon";
import { VerticalCollapseIcon } from "../../../atoms/icons/VerticalCollapseIcon";

export interface SprintPlanningPanelStateProps {
    className?: string;
    renderMobile?: boolean;
    sprints: SprintPlanningPanelSprint[];
}

export interface SprintPlanningPanelDispatchProps {
    onExpandCollapse: { (id: string, expand: boolean): void };
}

export type SprintPlanningPanelProps = SprintPlanningPanelStateProps & SprintPlanningPanelDispatchProps & WithTranslation;

export const InnerSprintPlanningPanel: React.FC<SprintPlanningPanelProps> = (props) => {
    const onExpandCollapse = (id: string, expand: boolean) => {
        if (props.onExpandCollapse) {
            props.onExpandCollapse(id, expand);
        }
    };
    const classNameToUse = buildClassName(
        css.sprintPlanningPanel,
        css.backlogItemPlanningPanel,
        props.className,
        props.renderMobile ? css.mobile : null
    );
    const sprintItemElts = props.sprints.map((sprint) => {
        const expandCollapseIcon = sprint.expanded ? <VerticalCollapseIcon /> : <VerticalExpandIcon />;
        const contentsClassName = buildClassName(css.sprintContents, sprint.expanded ? css.expanded : null);
        return (
            <div key={sprint.name}>
                <SimpleDivider />
                <div className={css.sprintPanel} tabIndex={0}>
                    <div className={css.sprintHeaderAndContent}>
                        <div className={css.sprintHeader}>
                            <div className={css.sprintName}>{sprint.name}</div>
                            <div className={css.sprintHeaderContent}>
                                <div className={css.sprintHeaderContentTopRow}>
                                    <div className={css.sprintDateRange}>
                                        {formatDateRange(sprint.startDate, sprint.finishDate)}
                                    </div>
                                    <div className={css.sprintStatus}>{sprintStatusToString(sprint.status)}</div>
                                </div>
                                <div className={css.sprintHeaderContentInfoRow}>{buildSprintPointInfoText(sprint)}</div>
                            </div>
                        </div>
                        <div className={contentsClassName}>(contents)</div>
                    </div>
                    <div
                        className={css.expandCollapse}
                        onClick={() => {
                            onExpandCollapse(sprint.id, !sprint.expanded);
                        }}
                    >
                        {expandCollapseIcon}
                    </div>
                </div>
            </div>
        );
    });
    return <div className={classNameToUse}>{sprintItemElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
