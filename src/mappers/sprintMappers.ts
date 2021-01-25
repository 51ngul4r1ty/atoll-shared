// interfaces/types
import { ApiSprint } from "../apiModelTypes";
import { Sprint } from "../reducers/sprintsReducer";
import { DateOnly } from "../types/dateTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";
import { determineSprintExpanded } from "../utils/sprintStatusHelper";

export const mapApiItemToSprint = (apiItem: ApiSprint): Sprint => {
    const startDate = DateOnly.fromISODate(apiItem.startdate);
    const finishDate = DateOnly.fromISODate(apiItem.finishdate);
    return {
        acceptedPoints: apiItem.acceptedPoints,
        archived: apiItem.archived,
        backlogItemsLoaded: false,
        createdAt: isoDateStringToDate(apiItem.createdAt),
        expanded: determineSprintExpanded(startDate, finishDate),
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
