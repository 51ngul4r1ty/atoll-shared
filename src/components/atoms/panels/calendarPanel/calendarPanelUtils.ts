// interfaces / types
import { CalendarSprintRange } from "./calendarSprintTypes";
import { DateOnly } from "../../../../types/dateTypes";

export const sortSprints = (sprints: CalendarSprintRange[]): CalendarSprintRange[] =>
    !sprints ? [] : sprints.sort((sprint) => (sprint.start > sprint.finish ? 1 : 0));

export const inSprintRange = (sprint: CalendarSprintRange, day: DateOnly): boolean => {
    if (!sprint) {
        return false;
    }
    return day.gte(sprint.start) && day.lte(sprint.finish);
};

export const isFirstDay = (sprint: CalendarSprintRange, day: DateOnly): boolean => {
    if (!sprint) {
        return false;
    }
    return day.eq(sprint.start);
};

export const isLastDay = (sprint: CalendarSprintRange, day: DateOnly): boolean => {
    if (!sprint) {
        return false;
    }
    return day.eq(sprint.finish);
};

export const getStartingSprintIdx = (sprintsSorted: CalendarSprintRange[], day: DateOnly) => {
    if (sprintsSorted.length === 0) {
        return -1;
    }
    let sprintIdx = -1;
    for (let currentSprintIdx = 0; currentSprintIdx < sprintsSorted.length; currentSprintIdx++) {
        const currentSprint = sprintsSorted[currentSprintIdx];
        const inSprint = inSprintRange(currentSprint, day);
        if (inSprint) {
            if (sprintIdx > -1 && sprintIdx !== currentSprintIdx) {
                throw new Error("Sprint ranges overlap- this is an invalid state");
            }
            sprintIdx = currentSprintIdx;
        }
    }
    return sprintIdx === -1 ? 0 : sprintIdx;
};

export const getSprint = (sprintsSorted: CalendarSprintRange[], sprintIdx: number) => {
    if (sprintIdx === -1) {
        return null;
    }
    if (sprintIdx >= sprintsSorted.length) {
        return null;
    }
    return sprintsSorted[sprintIdx];
};

export const calcMonthToShow = (dates: DateOnly[]): number | null => {
    if (!dates.length) {
        return null;
    }
    const date = dates[0];
    return date.getMonth();
};

export const calcYearToShow = (dates: DateOnly[]) => {
    if (!dates.length) {
        return null;
    }
    const date = dates[0];
    return date.getYear();
};

export const calcCurrentMonth = (dates: DateOnly[]) => {
    if (!dates.length) {
        return null;
    }
    const date = dates[0];
    return date.getMonth();
};

export const calcFirstDayToShow = (dates: DateOnly[], startDayOfWeek?: number): DateOnly | null => {
    if (!dates.length) {
        return null;
    }
    const date = dates[0];
    const firstDayOfMonth = new DateOnly(date.getYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const leftmostDay = startDayOfWeek === undefined ? 1 : startDayOfWeek; // Monday - TODO: pick one based on sprint starts
    let diff = leftmostDay - dayOfWeek;
    if (diff > 0) {
        diff -= 7;
    }
    return firstDayOfMonth.addDays(diff);
};
