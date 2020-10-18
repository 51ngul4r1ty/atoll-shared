// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintPlanningPanel.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// components
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";

export enum SprintStatus {
    None = 0,
    NotStarted = 1,
    InProgress = 2,
    Completed = 3
}

export interface SprintPlanningPanelSprint {
    name: string;
    startDate: Date;
    finishDate: Date;
    status: SprintStatus;
}

export interface SprintPlanningPanelStateProps {
    className?: string;
    renderMobile?: boolean;
    sprints: SprintPlanningPanelSprint[];
}

export interface SprintPlanningPanelDispatchProps {}

export type SprintPlanningPanelProps = SprintPlanningPanelStateProps & SprintPlanningPanelDispatchProps & WithTranslation;

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const monthToString = (month: number) => {
    return MONTH_NAMES[month];
};

export const formatSameMonthRange = (startDate: Date, finishDate: Date): string => {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const finishDay = finishDate.getDate();
    const monthName = monthToString(startMonth);
    return `${monthName} ${startDay} to ${monthName} ${finishDay}, ${startYear}`;
};

export const formatSameYearRange = (startDate: Date, finishDate: Date): string => {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const finishMonth = finishDate.getMonth();
    if (startMonth === finishMonth) {
        return formatSameMonthRange(startDate, finishDate);
    } else {
        const startDay = startDate.getDate();
        const finishDay = finishDate.getDate();
        // e.g. "May 30 to June 12, 2019";
        return `${monthToString(startMonth)} ${startDay} to ${monthToString(finishMonth)} ${finishDay}, ${startYear}`;
    }
};

export const formatDateRange = (startDate: Date, finishDate: Date): string => {
    const startYear = startDate.getFullYear();
    const finishYear = finishDate.getFullYear();
    if (startYear === finishYear) {
        return formatSameYearRange(startDate, finishDate);
    } else {
        return "May 30 to June 12, 2019";
    }
};

export const sprintStatusToString = (status: SprintStatus): string => {
    switch (status) {
        case SprintStatus.NotStarted:
            return "Not Started";
        case SprintStatus.InProgress:
            return "In Progress";
        case SprintStatus.Completed:
            return "Completed";
        default:
            return `Unknown: ${status}`;
    }
};

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
                        <div className={css.sprintHeaderContentInfoRow}>points: 23 planned, 20 accepted, 3 for sprint</div>
                    </div>
                </div>
            </div>
        </div>
    ));
    return <div className={classNameToUse}>{sprintItemElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
