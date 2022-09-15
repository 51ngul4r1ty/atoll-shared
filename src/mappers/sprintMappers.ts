// interfaces/types
import type { ApiSprint } from "../types/apiModelTypes";
import type { Sprint } from "../reducers/sprints/sprintsReducerTypes";
import { DateOnly } from "../types/dateTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

export const mapApiItemToSprint = (apiItem: ApiSprint | null): Sprint | null => {
    if (!apiItem) {
        return null;
    }
    const startDate = DateOnly.fromISODate(apiItem.startdate);
    const finishDate = DateOnly.fromISODate(apiItem.finishdate);
    return {
        acceptedPoints: apiItem.acceptedPoints,
        archived: apiItem.archived,
        backlogItemsLoaded: false,
        createdAt: isoDateStringToDate(apiItem.createdAt),
        finishDate,
        id: apiItem.id,
        name: apiItem.name,
        plannedPoints: apiItem.plannedPoints,
        projectId: apiItem.projectId,
        remainingSplitPoints: apiItem.remainingSplitPoints,
        startDate,
        totalPoints: apiItem.totalPoints,
        updatedAt: isoDateStringToDate(apiItem.updatedAt),
        usedSplitPoints: apiItem.usedSplitPoints,
        velocityPoints: apiItem.velocityPoints
    };
};

export const mapApiItemsToSprints = (apiItems: ApiSprint[]): Sprint[] => {
    return apiItems.map((item) => mapApiItemToSprint(item));
};
