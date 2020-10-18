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

export interface SprintPlanningPanelStateProps {
    className?: string;
    renderMobile?: boolean;
    sprints: SprintPlanningPanelSprint[];
}

export interface SprintPlanningPanelDispatchProps {}

export type SprintPlanningPanelProps = SprintPlanningPanelStateProps & SprintPlanningPanelDispatchProps & WithTranslation;

export const InnerSprintPlanningPanel: React.FC<SprintPlanningPanelProps> = (props) => {
    const classNameToUse = buildClassName(
        css.sprintPlanningPanel,
        css.backlogItemPlanningPanel,
        props.className,
        props.renderMobile ? css.mobile : null
    );
    const sprintItemElts = props.sprints.map((sprint) => (
        <div key={sprint.name}>
            <SimpleDivider />
            <div className={css.sprintPanel}>
                <div className={css.sprintHeader}>
                    <div className={css.sprintName}>{sprint.name}</div>
                    <div className={css.sprintHeaderContent}>
                        <div className={css.sprintHeaderContentTopRow}>
                            <div className={css.sprintDateRange}>{formatDateRange(sprint.startDate, sprint.finishDate)}</div>
                            <div className={css.sprintStatus}>{sprintStatusToString(sprint.status)}</div>
                        </div>
                        <div className={css.sprintHeaderContentInfoRow}>{buildSprintPointInfoText(sprint)}</div>
                    </div>
                </div>
            </div>
        </div>
    ));
    return <div className={classNameToUse}>{sprintItemElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
