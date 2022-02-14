// consts/enums
import { BacklogItemStatus } from "../types/backlogItemEnums";

// interfaces/types
import type { ApiBacklogItem, ApiBacklogItemInSprint, ApiBacklogItemPart, ApiBacklogItemStatus } from "../apiModelTypes";
import type { BacklogItem, BacklogItemPart, BacklogItemInSprint } from "../types/backlogItemTypes";

// utils
import { dateToIsoDateString, isoDateStringToDate } from "../utils/apiPayloadConverters";

export const mapApiStatusToBacklogItem = (status: string | null): BacklogItemStatus => {
    switch (status) {
        case undefined:
        case null:
        case "N": {
            return BacklogItemStatus.NotStarted;
        }
        case "P": {
            return BacklogItemStatus.InProgress;
        }
        case "D": {
            return BacklogItemStatus.Done;
        }
        case "A": {
            return BacklogItemStatus.Accepted;
        }
        case "R": {
            return BacklogItemStatus.Released;
        }
        default: {
            throw new Error(`Unknown backlog item status "${status}"`);
        }
    }
};

export const mapBacklogItemStatusToApi = (status: BacklogItemStatus): ApiBacklogItemStatus | null => {
    switch (status) {
        case BacklogItemStatus.NotStarted: {
            return "N";
        }
        case BacklogItemStatus.InProgress: {
            return "P";
        }
        case BacklogItemStatus.Done: {
            return "D";
        }
        case BacklogItemStatus.Accepted: {
            return "A";
        }
        case BacklogItemStatus.Released: {
            return "R";
        }
        default: {
            throw new Error(`Unknown backlog item status "${status}"`);
        }
    }
};

export const mapApiItemToBacklogItem = (apiItem: ApiBacklogItem): BacklogItem => ({
    acceptanceCriteria: apiItem.acceptanceCriteria,
    acceptedAt: isoDateStringToDate(apiItem.acceptedAt),
    createdAt: isoDateStringToDate(apiItem.createdAt),
    estimate: apiItem.estimate,
    externalId: apiItem.externalId,
    finishedAt: isoDateStringToDate(apiItem.finishedAt),
    friendlyId: apiItem.friendlyId,
    id: apiItem.id,
    partIndex: apiItem.partIndex,
    projectId: apiItem.projectId,
    reasonPhrase: apiItem.reasonPhrase,
    releasedAt: isoDateStringToDate(apiItem.releasedAt),
    rolePhrase: apiItem.rolePhrase,
    startedAt: isoDateStringToDate(apiItem.startedAt),
    status: mapApiStatusToBacklogItem(apiItem.status),
    storyEstimate: apiItem.storyEstimate,
    storyPhrase: apiItem.storyPhrase,
    totalParts: apiItem.totalParts,
    type: apiItem.type,
    updatedAt: isoDateStringToDate(apiItem.updatedAt),
    unallocatedParts: apiItem.unallocatedParts,
    unallocatedPoints: apiItem.unallocatedPoints,
    version: apiItem.version
});

export const mapApiItemToBacklogItemPart = (apiItem: ApiBacklogItemPart): BacklogItemPart => ({
    id: apiItem.id,
    externalId: apiItem.externalId,
    backlogitemId: apiItem.backlogitemId,
    partIndex: apiItem.partIndex,
    percentage: apiItem.percentage,
    points: apiItem.points,
    startedAt: isoDateStringToDate(apiItem.startedAt),
    finishedAt: isoDateStringToDate(apiItem.finishedAt),
    status: mapApiStatusToBacklogItem(apiItem.status)
});

export const mapApiItemToBacklogItemInSprint = (apiItem: ApiBacklogItemInSprint): BacklogItemInSprint => {
    const result: BacklogItemInSprint = {
        ...mapApiItemToBacklogItem(apiItem),
        backlogItemPartId: apiItem.backlogItemPartId,
        storyEstimate: apiItem.storyEstimate,
        displayindex: apiItem.displayindex,
        partPercentage: apiItem.partPercentage,
        storyStatus: mapApiStatusToBacklogItem(apiItem.storyStatus),
        storyStartedAt: isoDateStringToDate(apiItem.storyStartedAt),
        storyFinishedAt: isoDateStringToDate(apiItem.storyFinishedAt),
        storyUpdatedAt: isoDateStringToDate(apiItem.storyUpdatedAt),
        storyVersion: apiItem.storyVersion
    };
    return result;
};

export const mapBacklogItemToApiItem = (item: BacklogItem): ApiBacklogItem => ({
    acceptanceCriteria: item.acceptanceCriteria,
    acceptedAt: dateToIsoDateString(item.acceptedAt),
    estimate: item.estimate,
    externalId: item.externalId,
    finishedAt: dateToIsoDateString(item.finishedAt),
    friendlyId: item.friendlyId,
    id: item.id,
    partIndex: item.partIndex,
    projectId: item.projectId,
    reasonPhrase: item.reasonPhrase,
    releasedAt: dateToIsoDateString(item.releasedAt),
    rolePhrase: item.rolePhrase,
    startedAt: dateToIsoDateString(item.startedAt),
    status: mapBacklogItemStatusToApi(item.status),
    storyEstimate: item.storyEstimate,
    storyPhrase: item.storyPhrase,
    totalParts: item.totalParts,
    type: item.type,
    unallocatedParts: item.unallocatedParts,
    unallocatedPoints: item.unallocatedPoints
});

export const mapSprintBacklogItemToApiItem = (item: BacklogItemInSprint): ApiBacklogItemInSprint => {
    const result: ApiBacklogItemInSprint = {
        ...mapBacklogItemToApiItem(item),
        backlogItemPartId: item.backlogItemPartId,
        storyEstimate: item.storyEstimate,
        displayindex: item.displayindex,
        partPercentage: item.partPercentage,
        storyStatus: mapBacklogItemStatusToApi(item.storyStatus),
        storyStartedAt: dateToIsoDateString(item.storyStartedAt),
        storyFinishedAt: dateToIsoDateString(item.storyFinishedAt),
        storyUpdatedAt: dateToIsoDateString(item.storyUpdatedAt),
        storyVersion: item.storyVersion
    };
    return result;
};

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};

export const mapApiItemsToSprintBacklogItems = (apiItems: ApiBacklogItemInSprint[]): BacklogItemInSprint[] => {
    return apiItems.map((item) => mapApiItemToBacklogItemInSprint(item));
};
