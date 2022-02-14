// interfaces/types
import { WebsocketPushNotificationData } from "../../types";
import { BacklogItem, BacklogItemInSprint } from "../../types/backlogItemTypes";
import { PushState, Source } from "../enums";

export type SelectedBacklogItems = string[];

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    selectedItemIds: SelectedBacklogItems;
    currentItem: SaveableBacklogItem;
    savedCurrentItem: SaveableBacklogItem;
    openedDetailMenuBacklogItemId: string | null;
}>;

export interface EditableBacklogItem extends BacklogItem {
    editing?: boolean;
}

export interface SaveableBacklogItem extends EditableBacklogItem {
    saved?: boolean;
}

export interface SaveableBacklogItemInSprint extends BacklogItemInSprint, SaveableBacklogItem {}

export interface ItemWithSource {
    source: Source;
    pushState?: PushState;
}

export interface BacklogItemWithSource extends SaveableBacklogItem, ItemWithSource {
    /* from ItemWithSource */
    source: Source;
    pushState?: PushState;
}

export interface BacklogItemInSprintWithSource extends SaveableBacklogItemInSprint, ItemWithSource {
    /* from ItemWithSource */
    source: Source;
    pushState?: PushState;
}
