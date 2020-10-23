// interfaces/types
import { ApiBacklogItem } from "../apiModelTypes";
import { BacklogItem } from "../types/backlogItemTypes";

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
    projectId: apiItem.projectId
});

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};
