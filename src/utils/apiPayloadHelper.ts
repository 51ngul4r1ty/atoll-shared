// interfaces/types
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
    projectId: backlogItem.projectId
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

/*
            "projectId": "69a9288264964568beb5dd243dc29008",
            "version": 0,
            "name": "Sprint 35",
            "startdate": "2020-11-01T04:00:00.000Z",
            "finishdate": "2020-11-14T04:00:00.000Z",
            "plannedPoints": null,
            "acceptedPoints": null,
            "velocityPoints": null,
            "usedSplitPoints": null,
            "remainingSplitPoints": null,
            "id": "c52b8053ae764944a67ef517686d2d7f",
            "updatedAt": "2020-11-11T04:31:51.070Z",
            "createdAt": "2020-11-11T04:31:51.070Z",
            "displayindex": null
*/
