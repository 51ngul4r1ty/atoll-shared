// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA, BaseModelItem } from "../types";
import {
    AddNewBacklogItemAction,
    UpdateBacklogItemFieldsAction,
    CancelUnsavedBacklogItemAction,
    ApiPostBacklogItemSuccessAction,
    ReceivePushedBacklogItemAction,
    ReorderBacklogItemAction,
    ToggleBacklogItemDetailAction,
    RemoveBacklogItemAction,
    EditBacklogItemAction,
    CancelEditBacklogItemAction,
    GetBacklogItemsSuccessAction,
    GetBacklogItemSuccessAction,
    UpdateBacklogItemAction
} from "../actions/backlogItems";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import { LinkedList } from "../utils/linkedList";
import {
    BacklogItemDetailFormEditableFields,
    BacklogItemDetailFormEditableFieldsWithInstanceId
} from "../components/organisms/forms/BacklogItemDetailForm";
import { ApiBacklogItem } from "../apiModelTypes";

export type BacklogItemType = "story" | "issue";

export interface BacklogItemModel extends BaseModelItem {
    createdAt: Date;
    estimate: number | null;
    externalId: string | null;
    reasonPhrase: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    type: BacklogItemType;
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

export enum BacklogItemSource {
    Added,
    Loaded,
    Pushed
}

export interface BacklogItemWithSource extends SaveableBacklogItem {
    source: BacklogItemSource;
}

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    pushedItems: Partial<PushBacklogItemModel>[];
    items: EditableBacklogItem[];
    allItems: BacklogItemWithSource[];
    openedDetailMenuBacklogItemId: string | null;
}>;

export const initialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    pushedItems: [],
    items: [],
    allItems: [],
    openedDetailMenuBacklogItemId: null
});

export const convertSaved = (saved: boolean | undefined): boolean => {
    if (saved === true) {
        return true;
    } else if (saved === false) {
        return false;
    } else {
        // default to saved if it isn't provided
        return true;
    }
};

export const addSource = (item: SaveableBacklogItem, source: BacklogItemSource) => ({
    ...item,
    source,
    saved: convertSaved(item.saved)
});

export const addSourceToPushedItem = (item: Partial<PushBacklogItemModel>, source: BacklogItemSource) => ({
    ...item,
    source,
    saved: convertSaved(undefined)
});

export const mapPushedToBacklogItem = (pushedItem: Partial<PushBacklogItemModel>): BacklogItemWithSource => ({
    id: pushedItem.id,
    instanceId: undefined,
    source: BacklogItemSource.Pushed,
    createdAt: pushedItem.createdAt,
    estimate: pushedItem.estimate,
    externalId: pushedItem.externalId,
    reasonPhrase: pushedItem.reasonPhrase,
    rolePhrase: pushedItem.rolePhrase,
    storyPhrase: pushedItem.storyPhrase,
    type: pushedItem.type
});

export const rebuildAllItems = (draft: Draft<BacklogItemsState>) => {
    const allItems = new LinkedList<BacklogItemWithSource>();
    const addedItems = draft.addedItems.map(
        (item) => addSource(item, BacklogItemSource.Added) /* addSourceAndId(item, BacklogItemSource.Added) */
    );
    allItems.addArray2("id", "instanceId", addedItems);
    const loadedItems = draft.items.map((item) => addSource(item, BacklogItemSource.Loaded));
    allItems.addArray("id", loadedItems);
    const pushedItems = draft.pushedItems.map((item) => addSourceToPushedItem(item, BacklogItemSource.Pushed));
    pushedItems.forEach((pushedItem) => {
        if (pushedItem.prevBacklogItemId) {
            allItems.addLink(pushedItem.prevBacklogItemId, pushedItem.id);
        } else {
            allItems.addLink(pushedItem.id, pushedItem.nextBacklogItemId);
        }
        allItems.addItemData(pushedItem.id, mapPushedToBacklogItem(pushedItem));
    });
    draft.allItems = allItems.toArray();
};

export const idsMatch = (item1: BacklogItem, item2: BacklogItemDetailFormEditableFieldsWithInstanceId): boolean => {
    const instanceIdMatch = !!item1.instanceId && item1.instanceId === item2.instanceId;
    const idMatch = !!item1.id && item1.id === item2.id;
    return instanceIdMatch || idMatch;
};

export const updateItemFieldsInAllItems = (
    draft: Draft<BacklogItemsState>,
    payload: BacklogItemDetailFormEditableFieldsWithInstanceId
) => {
    const item = draft.allItems.filter((item) => idsMatch(item, payload));
    if (item.length === 1) {
        updateBacklogItemFields(item[0], payload);
    }
};

export const updateBacklogItemFields = (backlogItem: BacklogItem, payload: BacklogItemDetailFormEditableFields) => {
    backlogItem.estimate = payload.estimate;
    backlogItem.externalId = payload.externalId;
    backlogItem.storyPhrase = payload.storyPhrase;
    backlogItem.reasonPhrase = payload.reasonPhrase;
    backlogItem.rolePhrase = payload.rolePhrase;
};

export const updateItemById = (draft: Draft<BacklogItemsState>, itemId: string, updateItem: { (item: EditableBacklogItem) }) => {
    const idx = draft.addedItems.findIndex((item) => item.id === itemId);
    if (idx >= 0) {
        updateItem(draft.addedItems[idx]);
    }
    const idx2 = draft.items.findIndex((item) => item.id === itemId);
    if (idx2 >= 0) {
        updateItem(draft.items[idx2]);
    }
};

export const mapApiItemToBacklogItem = (apiItem: ApiBacklogItem): BacklogItem => ({
    id: apiItem.id,
    externalId: apiItem.externalId,
    rolePhrase: apiItem.rolePhrase,
    storyPhrase: apiItem.storyPhrase,
    reasonPhrase: apiItem.reasonPhrase,
    estimate: apiItem.estimate,
    type: apiItem.type,
    createdAt: apiItem.createdAt
});

export const mapApiItemsToBacklogItems = (apiItems: ApiBacklogItem[]): BacklogItem[] => {
    return apiItems.map((item) => mapApiItemToBacklogItem(item));
};

export const backlogItemsReducer = (state: BacklogItemsState = initialState, action: AnyFSA): BacklogItemsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as GetBacklogItemsSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToBacklogItems(payload.response.data.items);
                draft.pushedItems = [];
                draft.addedItems = [];
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as GetBacklogItemSuccessAction;
                const { payload } = actionTyped;
                const backlogItem = mapApiItemToBacklogItem(payload.response.data.item);
                const newItems = [];
                draft.items.forEach((item) => {
                    if (item.id === backlogItem.id) {
                        item = { ...item, ...backlogItem };
                    }
                    newItems.push(item);
                });
                draft.items = newItems;
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiPostBacklogItemSuccessAction;
                const { payload, meta } = actionTyped;
                const updatedBacklogItem = payload.response.data.item;
                const instanceId = meta.instanceId;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === instanceId) {
                        addedItem.id = updatedBacklogItem.id;
                        addedItem.saved = true;
                    }
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.ADD_BACKLOG_ITEM: {
                const actionTyped = action as AddNewBacklogItemAction;
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: actionTyped.payload.type,
                        instanceId: actionTyped.payload.instanceId,
                        saved: false
                    } as SaveableBacklogItem
                ];
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_UNSAVED_BACKLOG_ITEM: {
                const actionTyped = action as CancelUnsavedBacklogItemAction;
                const newItems = [];
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId !== actionTyped.payload.instanceId) {
                        newItems.push(addedItem);
                    }
                });
                draft.addedItems = newItems;
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM: {
                const actionTyped = action as CancelEditBacklogItemAction;
                updateItemById(draft, actionTyped.payload.itemId, (item) => {
                    item.editing = false;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM: {
                const actionTyped = action as UpdateBacklogItemAction;
                updateItemById(draft, actionTyped.payload.id, (item) => {
                    item.editing = false;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS: {
                const actionTyped = action as UpdateBacklogItemFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (idsMatch(addedItem, actionTyped.payload)) {
                        updateBacklogItemFields(addedItem, actionTyped.payload);
                    }
                });
                draft.items.forEach((addedItem) => {
                    if (idsMatch(addedItem, actionTyped.payload)) {
                        updateBacklogItemFields(addedItem, actionTyped.payload);
                    }
                });
                updateItemFieldsInAllItems(draft, actionTyped.payload);
                return;
            }
            case ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM: {
                const actionTyped = action as ReceivePushedBacklogItemAction;
                draft.pushedItems.push(actionTyped.payload);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as ToggleBacklogItemDetailAction;
                if (draft.openedDetailMenuBacklogItemId === null) {
                    draft.openedDetailMenuBacklogItemId = actionTyped.payload.itemId;
                } else if (draft.openedDetailMenuBacklogItemId === actionTyped.payload.itemId) {
                    draft.openedDetailMenuBacklogItemId = null;
                } else {
                    draft.openedDetailMenuBacklogItemId = actionTyped.payload.itemId;
                }
                return;
            }
            case ActionTypes.EDIT_BACKLOG_ITEM: {
                const actionTyped = action as EditBacklogItemAction;
                updateItemById(draft, actionTyped.payload.itemId, (item) => {
                    item.editing = true;
                });
                rebuildAllItems(draft);
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.REORDER_BACKLOG_ITEM: {
                const actionTyped = action as ReorderBacklogItemAction;
                let idx = 0;
                let sourceItemIdx: number = null;
                let targetItemIdx: number = null;
                let sourceItem: BacklogItemWithSource = null;
                draft.allItems.forEach((item) => {
                    if (item.id === actionTyped.payload.sourceItemId) {
                        sourceItem = item;
                        sourceItemIdx = idx;
                    }
                    if (item.id === actionTyped.payload.targetItemId) {
                        targetItemIdx = idx;
                    }
                    idx++;
                });
                if (sourceItemIdx !== null && targetItemIdx !== null && sourceItemIdx !== targetItemIdx) {
                    if (sourceItemIdx < targetItemIdx) {
                        // move down, move below target item
                        draft.allItems.splice(targetItemIdx, 0, sourceItem);
                        draft.allItems.splice(sourceItemIdx, 1);
                    } else {
                        // move up, move above target item
                        draft.allItems.splice(sourceItemIdx, 1);
                        draft.allItems.splice(targetItemIdx, 0, sourceItem);
                    }
                } else if (sourceItemIdx !== null && targetItemIdx === null) {
                    // re-order moved item to end of list
                    draft.allItems.push(sourceItem);
                    draft.allItems.splice(sourceItemIdx, 1);
                }
                return;
            }
            case ActionTypes.API_DELETE_BACKLOG_ITEM_REQUEST: {
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_DELETE_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as RemoveBacklogItemAction;
                const id = actionTyped.meta.originalActionArgs.backlogItemId;
                const idx = draft.addedItems.findIndex((item) => item.id === id);
                if (idx >= 0) {
                    draft.addedItems.splice(idx, 1);
                }
                const idx2 = draft.items.findIndex((item) => item.id === id);
                if (idx2 >= 0) {
                    draft.items.splice(idx2, 1);
                }
                rebuildAllItems(draft);
                return;
            }
        }
    });
