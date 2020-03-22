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
    ReceivePushedBacklogItemAction
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
    console.log("KEVIN - rebuildAllItems");
    const allItems = new LinkedList<BacklogItemWithSource>();
    const addedItems = draft.addedItems.map((item) => addSourceAndId(item, BacklogItemSource.Added));
    console.log("KEVIN - rebuildAllItems: addedItems count = ", addedItems.length);
    allItems.addArray("id", addedItems);
    const loadedItems = draft.items.map((item) => addSource(item, BacklogItemSource.Loaded));
    console.log("KEVIN - rebuildAllItems: loadedItems count = ", loadedItems.length);
    allItems.addArray("id", loadedItems);
    const pushedItems = draft.pushedItems.map((item) => addSource(item, BacklogItemSource.Pushed));
    // TODO: Find out why this results in just a single item in the linked list:
    pushedItems.forEach((pushedItem) => {
        allItems.addLink(pushedItem.prevBacklogItemId, pushedItem.id);
        allItems.addItemData(pushedItem.id, mapPushedToBacklogItem(pushedItem));
    });
    //    allItems.addArray("id", pushedItems);
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
        }
    });
