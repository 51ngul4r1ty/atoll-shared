import { DateOnly } from "../types/dateTypes";

export const buildSprintForTesting = (uniqueIdx: number, baseDate: DateOnly) => ({
    id: `fake-id-${uniqueIdx}`,
    acceptedPoints: 5,
    archived: true,
    backlogItemsLoaded: true,
    expanded: true,
    finishDate: baseDate.addDays(13),
    name: `fake-name-${uniqueIdx}`,
    plannedPoints: 20,
    projectId: `fake-project-id-${uniqueIdx}`,
    remainingSplitPoints: 8,
    startDate: baseDate,
    totalPoints: 25,
    usedSplitPoints: 3,
    velocityPoints: 23,
    editing: false,
    createdAt: null,
    updatedAt: null,
    version: 1
});
