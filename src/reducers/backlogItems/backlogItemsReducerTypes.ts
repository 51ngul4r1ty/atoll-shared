// interfaces/types
import { WebsocketPushNotificationData } from "../../types";
import { BacklogItem } from "../../types/backlogItemTypes";

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    openedDetailMenuBacklogItemId: string | null;
}>;

export enum BacklogItemSource {
    Added,
    Loaded,
    Pushed
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
