// interfaces/types
import { mapBacklogItemStatusToApi } from "../mappers/backlogItemMappers";
import { Sprint } from "../reducers/sprintsReducer";
import { BacklogItemModel, BacklogItem } from "../types/backlogItemTypes";
import { SprintModel } from "../types/sprintTypes";

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
    projectId: backlogItem.projectId,
    status: backlogItem.status
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
