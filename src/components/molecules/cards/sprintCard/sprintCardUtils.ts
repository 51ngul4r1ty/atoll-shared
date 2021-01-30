// utils
import { monthToAbbrString } from "../../../../utils/dateHelper";

// interfaces/types
import { DateOnly } from "../../../../types/dateTypes";
import { SprintCardSprint, SprintStatus } from "./sprintCardTypes";

export const formatSameMonthRange = (startDate: DateOnly, finishDate: DateOnly): string => {
    const startYear = startDate.getYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDay();
    const finishDay = finishDate.getDay();
    const monthName = monthToAbbrString(startMonth, 1);
    return `${monthName} ${startDay} to ${finishDay}, ${startYear}`;
};

export const formatSameYearRange = (startDate: DateOnly, finishDate: DateOnly): string => {
    const startYear = startDate.getYear();
    const startMonth = startDate.getMonth();
    const finishMonth = finishDate.getMonth();
    if (startMonth === finishMonth) {
        return formatSameMonthRange(startDate, finishDate);
    } else {
        const startDay = startDate.getDay();
        const finishDay = finishDate.getDay();
        // e.g. "May 30 to June 12, 2019";
        return `${monthToAbbrString(startMonth, 1)} ${startDay} to ${monthToAbbrString(finishMonth, 1)} ${finishDay}, ${startYear}`;
    }
};

export const formatDiffYearRange = (startDate: DateOnly, finishDate: DateOnly): string => {
    const startYear = startDate.getYear();
    const finishYear = finishDate.getYear();
    const startMonth = startDate.getMonth();
    const finishMonth = finishDate.getMonth();
    const startDay = startDate.getDay();
    const finishDay = finishDate.getDay();
    // e.g. "May 30, 2019 to June 12, 2020";
    const startDateString = `${monthToAbbrString(startMonth, 1)} ${startDay}, ${startYear}`;
    const finishDateString = `${monthToAbbrString(finishMonth, 1)} ${finishDay}, ${finishYear}`;
    return `${startDateString} to ${finishDateString}`;
};

export const formatDateRange = (startDate: DateOnly, finishDate: DateOnly): string => {
    const startYear = startDate.getYear();
    const finishYear = finishDate.getYear();
    if (startYear === finishYear) {
        return formatSameYearRange(startDate, finishDate);
    } else {
        return formatDiffYearRange(startDate, finishDate);
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
