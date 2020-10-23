// interfaces/types
import { BacklogItemModel, BacklogItem } from "../types/backlogItemTypes";

export const convertToBacklogItemModel = (backlogItem: BacklogItem): BacklogItemModel => ({
    createdAt: backlogItem.createdAt,
    updatedAt: backlogItem.updatedAt,
    // displayIndex: backlogItem.displayIndex,
    estimate: backlogItem.estimate,
    friendlyId: backlogItem.friendlyId,
    externalId: backlogItem.externalId,
    id: backlogItem.id,
    reasonPhrase: backlogItem.reasonPhrase,
    rolePhrase: backlogItem.rolePhrase,
    storyPhrase: backlogItem.storyPhrase,
    type: backlogItem.type,
    projectId: backlogItem.projectId
});
