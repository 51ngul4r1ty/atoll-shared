import { addDays } from "../../../../utils/dateHelper";
import { SprintPlanningPanelSprint, SprintStatus } from "./sprintPlanningPanelTypes";

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
    return `${monthName} ${startDay} to ${finishDay}, ${startYear}`;
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

export const formatDiffYearRange = (startDate: Date, finishDate: Date): string => {
    const startYear = startDate.getFullYear();
    const finishYear = finishDate.getFullYear();
    const startMonth = startDate.getMonth();
    const finishMonth = finishDate.getMonth();
    const startDay = startDate.getDate();
    const finishDay = finishDate.getDate();
    // e.g. "May 30, 2019 to June 12, 2020";
    return `${monthToString(startMonth)} ${startDay}, ${startYear} to ${monthToString(finishMonth)} ${finishDay}, ${finishYear}`;
};

export const formatDateRange = (startDate: Date, finishDate: Date): string => {
    const finishDateToUse = addDays(finishDate, -1);
    const startYear = startDate.getFullYear();
    const finishYear = finishDateToUse.getFullYear();
    if (startYear === finishYear) {
        return formatSameYearRange(startDate, finishDateToUse);
    } else {
        return formatDiffYearRange(startDate, finishDateToUse);
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

export const buildSprintPointInfoText = (sprint: SprintPlanningPanelSprint, renderMobile: boolean): string => {
    if (sprint.status === SprintStatus.Completed) {
        return buildCompletedSprintPointInfoText(sprint, renderMobile);
    } else if (sprint.status === SprintStatus.NotStarted) {
        return buildNotStartedSprintPointInfoText(sprint, renderMobile);
    } else {
        return buildInProgressSprintPointInfoText(sprint, renderMobile);
    }
};

export const formatForDevice = (parts: string[], renderMobile: boolean) => {
    if (renderMobile) {
        return `Points:\n${parts.join(",\n")}`;
    } else {
        return `points: ${parts.join(", ")}`;
    }
};

export const buildCompletedSprintPointInfoText = (sprint: SprintPlanningPanelSprint, renderMobile: boolean): string => {
    const parts: string[] = [];
    if (sprint.plannedPoints) {
        parts.push(`${sprint.plannedPoints} planned`);
    }
    if (sprint.acceptedPoints) {
        parts.push(`${sprint.acceptedPoints} accepted`);
    }
    if (sprint.usedSplitPoints) {
        parts.push(`${sprint.usedSplitPoints} for split`);
    }
    if (!parts.length) {
        return "";
    } else {
        return formatForDevice(parts, renderMobile);
    }
};

export const buildInProgressSprintPointInfoText = (sprint: SprintPlanningPanelSprint, renderMobile: boolean): string => {
    return buildCompletedSprintPointInfoText(sprint, renderMobile);
};

export const buildNotStartedSprintPointInfoText = (sprint: SprintPlanningPanelSprint, renderMobile: boolean): string => {
    const parts: string[] = [];
    if (sprint.plannedPoints && sprint.velocityPoints) {
        parts.push(`${sprint.plannedPoints} of ${sprint.velocityPoints} planned`);
        if (sprint.remainingSplitPoints) {
            parts.push(`(${sprint.remainingSplitPoints} from split)`);
        }
    }
    if (!parts.length) {
        return "";
    } else {
        return formatForDevice(parts, renderMobile);
    }
};
