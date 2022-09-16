// interfaces/types
import type { BacklogItem, BacklogItemInSprint } from "../../types/backlogItemTypes";
import type { BacklogItemPart } from "../../types/backlogItemPartTypes";
import type { Sprint } from "../sprints/sprintsReducerTypes";
import type { WebsocketPushNotificationData } from "../../types/pushTypes";

// consts/enums
import { PushState, Source } from "../../reducers/enums";

export type SelectedBacklogItems = string[];

export type BacklogItemPartAndSprint = {
    part: BacklogItemPart;
    sprint: Sprint;
};

export type BacklogItemPartUiState = {
    editable: boolean;
};

export type BacklogItemPartAndSprintWithUiState = BacklogItemPartAndSprint & {
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
    joinUnallocatedPartsInProgress: boolean;
}>;

export interface EditableBacklogItem extends BacklogItem {
    editing?: boolean;
    saving: boolean;
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
