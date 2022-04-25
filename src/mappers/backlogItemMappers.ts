// interfaces/types
import type { EditableBacklogItem } from "../reducers/backlogItems/backlogItemsReducerTypes";
import type { ApiBacklogItem, ApiBacklogItemInSprint } from "../types/apiModelTypes";
import type { BacklogItem, BacklogItemInSprint } from "../types/backlogItemTypes";

// utils
import { dateToIsoDateString, isoDateStringToDate } from "../utils/apiPayloadConverters";
import { mapApiStatusToBacklogItem, mapBacklogItemStatusToApi } from "./statusMappers";

export const mapApiItemToBacklogItem = (apiItem: ApiBacklogItem): BacklogItem => ({
    acceptanceCriteria: apiItem.acceptanceCriteria,
    acceptedAt: isoDateStringToDate(apiItem.acceptedAt),
    createdAt: isoDateStringToDate(apiItem.createdAt),
    estimate: apiItem.estimate,
    externalId: apiItem.externalId,
    finishedAt: isoDateStringToDate(apiItem.finishedAt),
    friendlyId: apiItem.friendlyId,
    id: apiItem.id,
    partIndex: apiItem.partIndex,
    projectId: apiItem.projectId,
    reasonPhrase: apiItem.reasonPhrase,
    releasedAt: isoDateStringToDate(apiItem.releasedAt),
    rolePhrase: apiItem.rolePhrase,
    startedAt: isoDateStringToDate(apiItem.startedAt),
    status: mapApiStatusToBacklogItem(apiItem.status),
    storyEstimate: apiItem.storyEstimate,
    storyPhrase: apiItem.storyPhrase,
    totalParts: apiItem.totalParts,
    type: apiItem.type,
    updatedAt: isoDateStringToDate(apiItem.updatedAt),
    unallocatedParts: apiItem.unallocatedParts,
    unallocatedPoints: apiItem.unallocatedPoints,
    version: apiItem.version
});

export const mapApiItemToEditableBacklogItem = (apiItem: ApiBacklogItem): EditableBacklogItem => ({
    ...mapApiItemToBacklogItem(apiItem),
    saving: false
});

export const mapApiItemToBacklogItemInSprint = (apiItem: ApiBacklogItemInSprint): BacklogItemInSprint => {
    const result: BacklogItemInSprint = {
        ...mapApiItemToBacklogItem(apiItem),
        backlogItemPartId: apiItem.backlogItemPartId,
        storyEstimate: apiItem.storyEstimate,
        displayindex: apiItem.displayindex,
        partPercentage: apiItem.partPercentage,
        storyStatus: mapApiStatusToBacklogItem(apiItem.storyStatus),
        storyStartedAt: isoDateStringToDate(apiItem.storyStartedAt),
        storyFinishedAt: isoDateStringToDate(apiItem.storyFinishedAt),
        storyUpdatedAt: isoDateStringToDate(apiItem.storyUpdatedAt),
        storyVersion: apiItem.storyVersion
    };
    return result;
};

export const mapBacklogItemToApiItem = (item: BacklogItem): ApiBacklogItem => ({
    acceptanceCriteria: item.acceptanceCriteria,
    createdAt: dateToIsoDateString(item.createdAt),
    acceptedAt: dateToIsoDateString(item.acceptedAt),
    estimate: item.estimate,
    externalId: item.externalId,
    finishedAt: dateToIsoDateString(item.finishedAt),
    friendlyId: item.friendlyId,
    id: item.id,
    partIndex: item.partIndex,
    projectId: item.projectId,
    reasonPhrase: item.reasonPhrase,
    releasedAt: dateToIsoDateString(item.releasedAt),
    rolePhrase: item.rolePhrase,
    startedAt: dateToIsoDateString(item.startedAt),
    status: mapBacklogItemStatusToApi(item.status),
    storyEstimate: item.storyEstimate,
    storyPhrase: item.storyPhrase,
    totalParts: item.totalParts,
    type: item.type,
    unallocatedParts: item.unallocatedParts,
    unallocatedPoints: item.unallocatedPoints,
    updatedAt: dateToIsoDateString(item.updatedAt),
    version: item.version
});

export const mapSprintBacklogItemToApiItem = (item: BacklogItemInSprint): ApiBacklogItemInSprint => {
    const result: ApiBacklogItemInSprint = {
        ...mapBacklogItemToApiItem(item),
        backlogItemPartId: item.backlogItemPartId,
        storyEstimate: item.storyEstimate,
        displayindex: item.displayindex,
        partPercentage: item.partPercentage,
        storyStatus: mapBacklogItemStatusToApi(item.storyStatus),
        storyStartedAt: dateToIsoDateString(item.storyStartedAt),
        storyFinishedAt: dateToIsoDateString(item.storyFinishedAt),
        storyUpdatedAt: dateToIsoDateString(item.storyUpdatedAt),
        storyVersion: item.storyVersion
    };
    return result;
};

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};

export const mapApiItemsToEditableBacklogItems = (apiItems: ApiBacklogItem[]): EditableBacklogItem[] => {
    return apiItems.map((item) => mapApiItemToEditableBacklogItem(item));
};

export const mapApiItemsToSprintBacklogItems = (apiItems: ApiBacklogItemInSprint[]): BacklogItemInSprint[] | null => {
    if (!apiItems) {
        return null;
    }
    return apiItems.map((item) => mapApiItemToBacklogItemInSprint(item));
};
