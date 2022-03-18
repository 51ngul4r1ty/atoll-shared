// interfaces/types
import type { WebsocketPushNotificationData } from "../../types/pushTypes";
import type { BacklogItem, BacklogItemInSprint } from "../../types/backlogItemTypes";
import type { BacklogItemPartAndSprint } from "../../actions/apiBffViewsBacklogItem";

// consts/enums
import { PushState, Source } from "../../reducers/enums";
import { ApiBacklogItemPart, ApiSprint } from "../../types/apiModelTypes";

export type SelectedBacklogItems = string[];

export type BacklogItemPartUiState = {
    editable: boolean;
};

export type BacklogItemPartAndSprintWithUiState = BacklogItemPartAndSprint & {
    /* from BacklogItemPartAndSprint */
    part: ApiBacklogItemPart;
    sprint: ApiSprint;

    /* new in this type */
    state: BacklogItemPartUiState;
};

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: WebsocketPushNotificationData<any>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    selectedItemIds: SelectedBacklogItems;
    currentItem: SaveableBacklogItem;
    currentItemPartsAndSprints: BacklogItemPartAndSprintWithUiState[];
    savedCurrentItem: SaveableBacklogItem;
    openedDetailMenuBacklogItemId: string | null;
    openedDetailMenuBacklogItemPartId: string | null;
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
