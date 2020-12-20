// interfaces/types
import { WebsocketPushNotificationData } from "../../types";
import { BacklogItem } from "../../types/backlogItemTypes";
import { PushState, Source } from "../types";

export type SelectedBacklogItems = string[];

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    selectedItemIds: SelectedBacklogItems;
    currentItem: SaveableBacklogItem;
    openedDetailMenuBacklogItemId: string | null;
}>;

export interface EditableBacklogItem extends BacklogItem {
    editing?: boolean;
}

export interface SaveableBacklogItem extends EditableBacklogItem {
    saved?: boolean;
}

export interface BacklogItemWithSource extends SaveableBacklogItem {
    source: Source;
    pushState?: PushState;
}
