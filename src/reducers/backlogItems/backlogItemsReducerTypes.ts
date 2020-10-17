import { BaseModelItem, WebsocketPushNotificationData } from "../../types";

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    openedDetailMenuBacklogItemId: string | null;
}>;

export type BacklogItemType = "story" | "issue";

export enum BacklogItemSource {
    Added,
    Loaded,
    Pushed
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
    projectId: string; // TODO: Finish up code related to this
}

export interface BacklogItem extends BacklogItemModel {
    instanceId?: number | null;
}

export interface EditableBacklogItem extends BacklogItem {
    editing?: boolean;
}

export interface SaveableBacklogItem extends EditableBacklogItem {
    editing?: boolean;
    saved?: boolean;
}

export enum PushState {
    None,
    Changed,
    Removed
}

export interface BacklogItemWithSource extends SaveableBacklogItem {
    source: BacklogItemSource;
    pushState?: PushState;
}
