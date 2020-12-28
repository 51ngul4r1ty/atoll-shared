// interfaces/types
import { mapBacklogItemStatusToApi } from "../mappers/backlogItemMappers";
import { Sprint } from "../reducers/sprintsReducer";
import { BacklogItemModel, BacklogItem } from "../types/backlogItemTypes";
import { SprintModel } from "../types/sprintTypes";

export const convertToBacklogItemModel = (backlogItem: BacklogItem): BacklogItemModel => ({
    acceptanceCriteria: backlogItem.acceptanceCriteria,
    createdAt: backlogItem.createdAt,
    estimate: backlogItem.estimate,
    externalId: backlogItem.externalId,
    friendlyId: backlogItem.friendlyId,
    id: backlogItem.id,
    projectId: backlogItem.projectId,
    reasonPhrase: backlogItem.reasonPhrase,
    rolePhrase: backlogItem.rolePhrase,
    status: backlogItem.status,
    storyPhrase: backlogItem.storyPhrase,
    type: backlogItem.type,
    updatedAt: backlogItem.updatedAt,
    startedAt: backlogItem.startedAt,
    finishedAt: backlogItem.finishedAt,
    acceptedAt: backlogItem.acceptedAt,
    releasedAt: backlogItem.releasedAt
});

export const convertToSprintModel = (sprint: Sprint): SprintModel => ({
    createdAt: sprint.createdAt,
    updatedAt: sprint.updatedAt,
    projectId: sprint.projectId,
    id: sprint.id,
    name: sprint.name,
    startdate: sprint.startDate,
    finishdate: sprint.finishDate,
    plannedPoints: sprint.plannedPoints,
    acceptedPoints: sprint.acceptedPoints,
    velocityPoints: sprint.velocityPoints,
    usedSplitPoints: sprint.usedSplitPoints,
    remainingSplitPoints: sprint.remainingSplitPoints
});
