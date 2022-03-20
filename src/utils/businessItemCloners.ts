// interfaces/types
import { ApiBacklogItem, ApiBacklogItemPart } from "../types/apiModelTypes";

export const cloneApiBacklogItem = (apiItem: ApiBacklogItem): ApiBacklogItem => ({
    acceptanceCriteria: apiItem.acceptanceCriteria,
    acceptedAt: apiItem.acceptedAt,
    createdAt: apiItem.createdAt,
    estimate: apiItem.estimate,
    externalId: apiItem.externalId,
    finishedAt: apiItem.finishedAt,
    friendlyId: apiItem.friendlyId,
    id: apiItem.id,
    partIndex: apiItem.partIndex,
    projectId: apiItem.projectId,
    reasonPhrase: apiItem.reasonPhrase,
    releasedAt: apiItem.releasedAt,
    rolePhrase: apiItem.rolePhrase,
    startedAt: apiItem.startedAt,
    status: apiItem.status,
    storyEstimate: apiItem.storyEstimate,
    storyPhrase: apiItem.storyPhrase,
    totalParts: apiItem.totalParts,
    type: apiItem.type,
    unallocatedParts: apiItem.unallocatedParts,
    unallocatedPoints: apiItem.unallocatedPoints,
    updatedAt: apiItem.updatedAt
});

export const cloneApiBacklogItemPart = (apiItemPart: ApiBacklogItemPart): ApiBacklogItemPart => ({
    backlogitemId: apiItemPart.backlogitemId,
    createdAt: apiItemPart.createdAt,
    externalId: apiItemPart.externalId,
    finishedAt: apiItemPart.finishedAt,
    id: apiItemPart.id,
    partIndex: apiItemPart.partIndex,
    percentage: apiItemPart.percentage,
    points: apiItemPart.points,
    startedAt: apiItemPart.startedAt,
    status: apiItemPart.status,
    updatedAt: apiItemPart.updatedAt
});
