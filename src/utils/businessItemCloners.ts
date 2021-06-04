// interfaces/types
import { ApiBacklogItem } from "../apiModelTypes";

export const cloneApiBacklogItem = (apiItem: ApiBacklogItem): ApiBacklogItem => ({
    acceptanceCriteria: apiItem.acceptanceCriteria,
    createdAt: apiItem.createdAt,
    estimate: apiItem.estimate,
    externalId: apiItem.externalId,
    friendlyId: apiItem.friendlyId,
    id: apiItem.id,
    projectId: apiItem.projectId,
    reasonPhrase: apiItem.reasonPhrase,
    rolePhrase: apiItem.rolePhrase,
    status: apiItem.status,
    storyPhrase: apiItem.storyPhrase,
    type: apiItem.type,
    updatedAt: apiItem.updatedAt,
    startedAt: apiItem.startedAt,
    finishedAt: apiItem.finishedAt,
    acceptedAt: apiItem.acceptedAt,
    releasedAt: apiItem.releasedAt,
    partIndex: apiItem.partIndex,
    totalParts: apiItem.totalParts,
    unallocatedParts: apiItem.unallocatedParts
});
