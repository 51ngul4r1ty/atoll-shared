// interfaces/types
import type { BaseModelItem } from "../types/dataModelTypes";

// consts/enums
import { BacklogItemStatus } from "./backlogItemEnums";

export type BacklogItemType = "story" | "issue";

export interface BacklogItemModel extends BaseModelItem {
    acceptanceCriteria: string | null;
    acceptedAt: Date | null;
    createdAt: Date;
    estimate: number | null;
    externalId: string | null;
    finishedAt: Date | null;
    friendlyId: string;
    partIndex: number | null;
    projectId: string; // TODO: Finish up code related to this
    reasonPhrase: string | null;
    releasedAt: Date | null;
    rolePhrase: string | null;
    startedAt: Date | null;
    status: BacklogItemStatus;
    storyEstimate?: number | null;
    storyPhrase: string;
    totalParts: number | null;
    type: BacklogItemType;
    unallocatedParts: number | null;
    unallocatedPoints: number | null;
    updatedAt: Date;
    version?: number;
}

export interface BacklogItem extends BacklogItemModel {
    // TODO: Maybe move this to "SaveableBacklogItem", is it really needed for the "base" BacklogItem?
    instanceId?: number | null;
}

export interface BacklogItemInSprint extends BacklogItem {
    backlogItemPartId: string;
    displayindex: number;
    partPercentage: number;
    storyStatus: BacklogItemStatus;
    storyStartedAt: Date | null;
    storyFinishedAt: Date | null;
    storyUpdatedAt: Date | null;
    storyVersion?: number;
}
