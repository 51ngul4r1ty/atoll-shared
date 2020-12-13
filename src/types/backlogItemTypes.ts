// interfaces/types
import { BaseModelItem } from "../types";

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
