// interfaces / types
import { CalendarSprintRange } from "./calendarSprintTypes";

// utils
import { roundDateToDayBoundary, sameDay } from "../../../../utils";

export const sortSprints = (sprints: CalendarSprintRange[]): CalendarSprintRange[] =>
    !sprints ? [] : sprints.sort((sprint) => (sprint.start > sprint.finish ? 1 : 0));

export const inSprintRange = (sprint: CalendarSprintRange, day: Date): boolean => {
    if (!sprint) {
        return false;
    }
    const dayRounded = roundDateToDayBoundary(day);
    return dayRounded >= roundDateToDayBoundary(sprint.start) && dayRounded <= roundDateToDayBoundary(sprint.finish);
};

export const isFirstDay = (sprint: CalendarSprintRange, day: Date): boolean => {
    if (!sprint) {
        return false;
    }
    const dayRounded = roundDateToDayBoundary(day);
    const sprintStartDay = roundDateToDayBoundary(sprint.start);
    // const result = dayRounded.getTime() == sprintStartDay.getTime();
    // console.log(`IS FIRST DAY: ${result} - ${dayRounded} vs ${sprintStartDay}`);
    return sameDay(dayRounded, sprintStartDay);
};

export const isLastDay = (sprint: CalendarSprintRange, day: Date): boolean => {
    if (!sprint) {
        return false;
    }
    const dayRounded = roundDateToDayBoundary(day);
    const sprintFinishDay = roundDateToDayBoundary(sprint.finish);
    return sameDay(dayRounded, sprintFinishDay);
};

export const getStartingSprintIdx = (sprintsSorted: CalendarSprintRange[], day: Date) => {
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
