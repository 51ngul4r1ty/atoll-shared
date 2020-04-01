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
    RelativePosition
} from "../actions/backlogItems";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import { LinkedList } from "../utils/linkedList";
import {
    BacklogItemDetailFormEditableFields,
    BacklogItemDetailFormEditableFieldsWithInstanceId
} from "../components/organisms/forms/BacklogItemDetailForm";

export type BacklogItemType = "story" | "issue";

export interface BacklogItemModel extends BaseModelItem {
    creationDateTime: Date;
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

export interface SaveableBacklogItem extends BacklogItem {
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
    items: BacklogItem[];
    allItems: BacklogItemWithSource[];
}>;

export const initialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    pushedItems: [],
    items: [],
    allItems: []
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

export const addSourceAndId = (item: SaveableBacklogItem, source: BacklogItemSource) => {
    let result = addSource(item, source);
    if (!result.id && result.source === BacklogItemSource.Added) {
        result.id = buildUnsavedItemId(result.instanceId);
    }
    return result;
};

export const UNSAVED_ITEM_ID_PREFIX = "unsaved-";

export const buildUnsavedItemId = (instanceId: number): string => {
    return `${UNSAVED_ITEM_ID_PREFIX}${instanceId}`;
};

export const isUnsavedItemId = (id: string): boolean => {
    return id?.startsWith(UNSAVED_ITEM_ID_PREFIX) || false;
};

export const mapPushedToBacklogItem = (pushedItem: Partial<PushBacklogItemModel>): BacklogItemWithSource => ({
    id: pushedItem.id,
    instanceId: undefined,
    source: BacklogItemSource.Pushed,
    creationDateTime: pushedItem.creationDateTime,
    estimate: pushedItem.estimate,
    externalId: pushedItem.externalId,
    reasonPhrase: pushedItem.reasonPhrase,
    rolePhrase: pushedItem.rolePhrase,
    storyPhrase: pushedItem.storyPhrase,
    type: pushedItem.type
});

export const rebuildAllItems = (draft: Draft<BacklogItemsState>) => {
    const allItems = new LinkedList<BacklogItemWithSource>();
    const addedItems = draft.addedItems.map((item) => addSourceAndId(item, BacklogItemSource.Added));
    allItems.addArray("id", addedItems);
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

export const updateItemFieldsInAllItems = (
    draft: Draft<BacklogItemsState>,
    payload: BacklogItemDetailFormEditableFieldsWithInstanceId
) => {
    const item = draft.allItems.filter((item) => item.instanceId == payload.instanceId);
    if (item.length === 1) {
        updateBacklogItem(item[0], payload);
    }
};

export const updateBacklogItem = (backlogItem: BacklogItem, payload: BacklogItemDetailFormEditableFields) => {
    backlogItem.estimate = payload.estimate;
    backlogItem.externalId = payload.externalId;
    backlogItem.storyPhrase = payload.storyPhrase;
    backlogItem.reasonPhrase = payload.reasonPhrase;
    backlogItem.rolePhrase = payload.rolePhrase;
};

export const backlogItemsReducer = (state: BacklogItemsState = initialState, action: AnyFSA): BacklogItemsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                // TODO: Add `const actionTyped = ` to make this type-safe
                const { payload } = action;
                draft.items = payload.response.data.items;
                draft.pushedItems = [];
                draft.addedItems = [];
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
            case ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS: {
                const actionTyped = action as UpdateBacklogItemFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === actionTyped.payload.instanceId) {
                        updateBacklogItem(addedItem, actionTyped.payload);
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
        }
    });
