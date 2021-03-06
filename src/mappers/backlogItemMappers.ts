// interfaces/types
import { ApiBacklogItem, ApiBacklogItemStatus } from "../apiModelTypes";
import { BacklogItem, BacklogItemStatus } from "../types/backlogItemTypes";
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
    createdAt: isoDateStringToDate(apiItem.createdAt),
    estimate: apiItem.estimate,
    externalId: apiItem.externalId,
    friendlyId: apiItem.friendlyId,
    id: apiItem.id,
    projectId: apiItem.projectId,
    reasonPhrase: apiItem.reasonPhrase,
    rolePhrase: apiItem.rolePhrase,
    status: mapApiStatusToBacklogItem(apiItem.status),
    storyPhrase: apiItem.storyPhrase,
    type: apiItem.type,
    updatedAt: isoDateStringToDate(apiItem.updatedAt),
    startedAt: isoDateStringToDate(apiItem.startedAt),
    finishedAt: isoDateStringToDate(apiItem.finishedAt),
    acceptedAt: isoDateStringToDate(apiItem.acceptedAt),
    releasedAt: isoDateStringToDate(apiItem.releasedAt)
});

export const mapBacklogItemToApiItem = (item: BacklogItem): ApiBacklogItem => ({
    id: item.id,
    friendlyId: item.friendlyId,
    externalId: item.externalId,
    rolePhrase: item.rolePhrase,
    storyPhrase: item.storyPhrase,
    reasonPhrase: item.reasonPhrase,
    estimate: item.estimate,
    type: item.type,
    projectId: item.projectId,
    status: mapBacklogItemStatusToApi(item.status),
    acceptanceCriteria: item.acceptanceCriteria,
    startedAt: dateToIsoDateString(item.startedAt),
    finishedAt: dateToIsoDateString(item.finishedAt),
    acceptedAt: dateToIsoDateString(item.acceptedAt),
    releasedAt: dateToIsoDateString(item.releasedAt)
});

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};
