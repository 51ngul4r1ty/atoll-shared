// interfaces/types
import type { WebsocketPushNotificationData } from "../../types/pushTypes";
import type { BacklogItem, BacklogItemInSprint } from "../../types/backlogItemTypes";
import type { BacklogItemPartAndSprint } from "../../actions/apiBffViewsBacklogItem";

// consts/enums
import { PushState, Source } from "../../reducers/enums";

export type SelectedBacklogItems = string[];

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    selectedItemIds: SelectedBacklogItems;
    currentItem: SaveableBacklogItem;
    currentItemPartsAndSprints: BacklogItemPartAndSprint[];
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
