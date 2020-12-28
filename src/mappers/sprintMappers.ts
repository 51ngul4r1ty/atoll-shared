// interfaces/types
import { ApiSprint } from "../apiModelTypes";
import { Sprint } from "../reducers/sprintsReducer";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

export const mapApiItemToSprint = (apiItem: ApiSprint): Sprint => ({
    acceptedPoints: apiItem.acceptedPoints,
    archived: apiItem.archived,
    backlogItemsLoaded: false,
    createdAt: isoDateStringToDate(apiItem.createdAt),
    expanded: false, // TODO: Add smart logic for this
    finishDate: isoDateStringToDate(apiItem.finishdate),
    id: apiItem.id,
    name: apiItem.name,
    plannedPoints: apiItem.plannedPoints,
    projectId: apiItem.projectId,
    remainingSplitPoints: apiItem.remainingSplitPoints,
    startDate: isoDateStringToDate(apiItem.startdate),
    totalPoints: apiItem.totalPoints,
    updatedAt: isoDateStringToDate(apiItem.updatedAt),
    usedSplitPoints: apiItem.usedSplitPoints,
    velocityPoints: apiItem.velocityPoints
});

export const mapApiItemsToSprints = (apiItems: ApiSprint[]): Sprint[] => {
    return apiItems.map((item) => mapApiItemToSprint(item));
};
