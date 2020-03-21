// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA, BaseModelItem } from "../types";
import {
    AddNewBacklogItemAction,
    UpdateBacklogItemFieldsAction,
    CancelUnsavedBacklogItemAction,
    ApiPostBacklogItemSuccessAction,
    ReceivePushedBacklogItemAction
} from "../actions/backlogItems";
import { PushBacklogItemModel } from "../middleware/wsMiddleware";
import { LinkedList } from "../utils/linkedList";

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
    instanceId: number | null;
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

export const addSource = <T>(item: T, source: BacklogItemSource) => ({ ...item, source });
export const addSourceAndId = (item: BacklogItem, source: BacklogItemSource) => {
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

export const backlogItemsReducer = (state: BacklogItemsState = initialState, action: AnyFSA): BacklogItemsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                // TODO: Add `const actionTyped = ` to make this type-safe
                const { payload } = action;
                draft.items = payload.response.data.items;
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
                return;
            }
            case ActionTypes.ADD_BACKLOG_ITEM: {
                const actionTyped = action as AddNewBacklogItemAction;
                //                const topIndex = draft.items.length ? draft.items[0].displayIndex : 1.0;
                // let newTopIndex = topIndex - draft.addedItems.length - 1.0;
                // draft.addedItems.forEach((addedItem) => {
                //     addedItem.displayIndex = newTopIndex;
                //     newTopIndex = newTopIndex + 1.0;
                // });
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: actionTyped.payload.type,
                        instanceId: actionTyped.payload.instanceId,
                        // displayIndex: newTopIndex,
                        saved: false
                    } as SaveableBacklogItem
                ];
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
                return;
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS: {
                const actionTyped = action as UpdateBacklogItemFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === actionTyped.payload.instanceId) {
                        addedItem.estimate = actionTyped.payload.estimate;
                        addedItem.externalId = actionTyped.payload.externalId;
                        addedItem.storyPhrase = actionTyped.payload.storyPhrase;
                        addedItem.reasonPhrase = actionTyped.payload.reasonPhrase;
                        addedItem.rolePhrase = actionTyped.payload.rolePhrase;
                    }
                });
                return;
            }
            case ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM: {
                // 1. add new item to pushedItems list
                const actionTyped = action as ReceivePushedBacklogItemAction;
                draft.pushedItems.push(actionTyped.payload);
                // 2. rebuild allItems list (to determine "highlighted divider" positions)
                const allItems = new LinkedList<BacklogItemWithSource>();
                const addedItems = draft.addedItems.map((item) => addSourceAndId(item, BacklogItemSource.Added));
                allItems.addArray("id", addedItems);
                console.log(`Kevin - AFTER ADDED ITEMS: ${allItems.getStatusText()}`);
                const loadedItems = draft.items.map((item) => addSource(item, BacklogItemSource.Loaded));
                allItems.addArray("id", loadedItems);
                console.log(`Kevin - AFTER LOADED ITEMS: ${allItems.getStatusText()}`);
                const pushedItems = draft.pushedItems.map((item) => addSource(item, BacklogItemSource.Pushed));
                allItems.addArray("id", pushedItems);
                console.log(`Kevin - AFTER PUSHED ITEMS: ${allItems.getStatusText()}`);
                draft.allItems = allItems.toArray();
                return;
            }
        }
    });
