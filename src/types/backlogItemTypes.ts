// interfaces/types
import { BaseModelItem, ISODateString } from "../types";

export type BacklogItemType = "story" | "issue";

export enum BacklogItemStatus {
    None = 0,
    NotStarted = 1, // DB: null
    InProgress = 2, // DB: 'P' = in progress
    Done = 3, // DB: 'D' = done
    Accepted = 4, // DB: 'A' = accepted
    Released = 5 // DB: 'R' = released
}

export interface BacklogItemModel extends BaseModelItem {
    acceptanceCriteria: string | null;
    createdAt: Date;
    estimate: number | null;
    externalId: string | null;
    friendlyId: string;
    projectId: string; // TODO: Finish up code related to this
    reasonPhrase: string | null;
    rolePhrase: string | null;
    status: BacklogItemStatus;
    storyPhrase: string;
    type: BacklogItemType;
    updatedAt: Date;
    version?: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    acceptedAt: Date | null;
    releasedAt: Date | null;
}

// TODO: Maybe move this to "SaveableBacklogItem", is it really needed
//       for the "base" BacklogItem?
export interface BacklogItem extends BacklogItemModel {
    instanceId?: number | null;
}
