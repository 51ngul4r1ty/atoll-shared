// utils
import { addDays, monthToAbbrString } from "../../../../utils/dateHelper";

// interfaces/types
import { SprintCardSprint, SprintStatus } from "./sprintCardTypes";

export const formatSameMonthRange = (startDate: Date, finishDate: Date): string => {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const finishDay = finishDate.getDate();
    const monthName = monthToAbbrString(startMonth);
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
        return `${monthToAbbrString(startMonth)} ${startDay} to ${monthToAbbrString(finishMonth)} ${finishDay}, ${startYear}`;
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
    return `${monthToAbbrString(startMonth)} ${startDay}, ${startYear} to ${monthToAbbrString(
        finishMonth
    )} ${finishDay}, ${finishYear}`;
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

export const buildSprintPointInfoText = (sprint: SprintCardSprint, renderMobile: boolean): string => {
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

export const hasSignificantValue = (value: number): boolean => value && (value >= 0.01 || value <= 0.01);

export const buildCompletedSprintPointInfoText = (sprint: SprintCardSprint, renderMobile: boolean): string => {
    const parts: string[] = [];
    if (sprint.plannedPoints) {
        parts.push(`${sprint.plannedPoints} planned`);
    }
    if (hasSignificantValue(sprint.totalPoints)) {
        const unplannedPoints = sprint.totalPoints - (sprint.plannedPoints || 0);
        if (hasSignificantValue(unplannedPoints)) {
            const wordToUse = unplannedPoints < 0 ? `removed` : `unplanned`;
            const valueToUse = unplannedPoints < 0 ? -unplannedPoints : unplannedPoints;
            parts.push(`${valueToUse} ${wordToUse}`);
        }
    }
    if (hasSignificantValue(sprint.acceptedPoints)) {
        parts.push(`${sprint.acceptedPoints} accepted`);
    }
    if (hasSignificantValue(sprint.usedSplitPoints)) {
        parts.push(`${sprint.usedSplitPoints} for split`);
    }
    if (!parts.length) {
        return "";
    } else {
        return formatForDevice(parts, renderMobile);
    }
};

export const buildInProgressSprintPointInfoText = (sprint: SprintCardSprint, renderMobile: boolean): string => {
    return buildCompletedSprintPointInfoText(sprint, renderMobile);
};

/**
 * When a sprint has not been started yet it is in planning mode.  The metrics displayed are intended to help with
 * that process so it shows the team's velocity here as well.
 * @param sprint
 * @param renderMobile
 */
export const buildNotStartedSprintPointInfoText = (sprint: SprintCardSprint, renderMobile: boolean): string => {
    const parts: string[] = [];
    if (hasSignificantValue(sprint.plannedPoints) || hasSignificantValue(sprint.velocityPoints)) {
        const ofText = sprint.velocityPoints ? ` of ${sprint.velocityPoints}` : "";
        parts.push(`${sprint.plannedPoints}${ofText} planned`);
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
