// interfaces/types
import { ApiBacklogItem } from "../apiModelTypes";
import { BacklogItem, BacklogItemStatus } from "../types/backlogItemTypes";

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
        default: {
            throw new Error(`Unknown backlog item status "${status}"`);
        }
    }
};

export const mapBacklogItemStatusToApi = (status: BacklogItemStatus): string | null => {
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
        default: {
            throw new Error(`Unknown backlog item status "${status}"`);
        }
    }
};

export const mapApiItemToBacklogItem = (apiItem: ApiBacklogItem): BacklogItem => ({
    id: apiItem.id,
    friendlyId: apiItem.friendlyId,
    externalId: apiItem.externalId,
    rolePhrase: apiItem.rolePhrase,
    storyPhrase: apiItem.storyPhrase,
    reasonPhrase: apiItem.reasonPhrase,
    estimate: apiItem.estimate,
    type: apiItem.type,
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    projectId: apiItem.projectId,
    status: mapApiStatusToBacklogItem(apiItem.status)
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
    status: mapBacklogItemStatusToApi(item.status)
});

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};
