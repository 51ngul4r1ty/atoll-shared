// interfaces/types
import { BaseModelItem } from "../types";

export type BacklogItemType = "story" | "issue";

export enum BacklogItemStatus {
    NotStarted = 0, // DB: null
    InProgress = 1, // DB: 'P' = in progress
    Done = 2 // DB: 'D' = done
}

export interface BacklogItemModel extends BaseModelItem {
    version?: number;
    createdAt: Date;
    updatedAt: Date;
    estimate: number | null;
    friendlyId: string;
    externalId: string | null;
    reasonPhrase: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    type: BacklogItemType;
    status: BacklogItemStatus;
    projectId: string; // TODO: Finish up code related to this
}

// TODO: Maybe move this to "SaveableBacklogItem", is it really needed
//       for the "base" BacklogItem?
export interface BacklogItem extends BacklogItemModel {
    instanceId?: number | null;
}
