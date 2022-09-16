// interfaces/types
import type { Sprint } from "../reducers/sprints/sprintsReducerTypes";
import type { BacklogItemModel, BacklogItem } from "../types/backlogItemTypes";
import type { SprintModel } from "../types/sprintTypes";

export const convertToBacklogItemModel = (backlogItem: BacklogItem): BacklogItemModel => ({
    acceptanceCriteria: backlogItem.acceptanceCriteria,
    acceptedAt: backlogItem.acceptedAt,
    createdAt: backlogItem.createdAt,
    estimate: backlogItem.estimate,
    externalId: backlogItem.externalId,
    finishedAt: backlogItem.finishedAt,
    friendlyId: backlogItem.friendlyId,
    id: backlogItem.id,
    partIndex: backlogItem.partIndex,
    projectId: backlogItem.projectId,
    reasonPhrase: backlogItem.reasonPhrase,
    releasedAt: backlogItem.releasedAt,
    rolePhrase: backlogItem.rolePhrase,
    startedAt: backlogItem.startedAt,
    status: backlogItem.status,
    storyEstimate: backlogItem.storyEstimate,
    storyPhrase: backlogItem.storyPhrase,
    totalParts: backlogItem.totalParts,
    type: backlogItem.type,
    unallocatedParts: backlogItem.unallocatedParts,
    unallocatedPoints: backlogItem.unallocatedPoints,
    updatedAt: backlogItem.updatedAt
});

export const convertToSprintModel = (sprint: Sprint): SprintModel => ({
    acceptedPoints: sprint.acceptedPoints,
    archived: sprint.archived,
    createdAt: sprint.createdAt,
    finishdate: sprint.finishDate.toISODate(),
    id: sprint.id,
    name: sprint.name,
    plannedPoints: sprint.plannedPoints,
    projectId: sprint.projectId,
    remainingSplitPoints: sprint.remainingSplitPoints,
    startdate: sprint.startDate.toISODate(),
    totalPoints: sprint.totalPoints,
    updatedAt: sprint.updatedAt,
    usedSplitPoints: sprint.usedSplitPoints,
    velocityPoints: sprint.velocityPoints
});
