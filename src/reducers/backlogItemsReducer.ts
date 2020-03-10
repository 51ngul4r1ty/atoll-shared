// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { AddNewBacklogItemAction, UpdateBacklogItemFieldsAction, CancelUnsavedBacklogItemAction } from "../actions/backlogItems";

export type BacklogItemType = "story" | "issue";

export interface BacklogItemModel {
    creationDateTime: Date;
    displayIndex: number;
    estimate: number | null;
    externalId: string | null;
    id: number;
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

export type BacklogItemsState = Readonly<{
    addedItems: SaveableBacklogItem[];
    items: BacklogItem[];
}>;

export const initialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    items: []
});

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
                // TODO: Add `const actionTyped = ` to make this type-safe
                const { payload, meta } = action;
                const updatedBacklogItem = payload.response.data.item;
                const instanceId = meta.instanceId;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === instanceId) {
                        addedItem.id = updatedBacklogItem.id;
                        addedItem.saved = true;
                        console.log("TODO: switch from editable to non-editable");
                    }
                });
                return;
            }
            case ActionTypes.ADD_BACKLOG_ITEM: {
                const actionTyped = action as AddNewBacklogItemAction;
                const topIndex = draft.items.length ? draft.items[0].displayIndex : 1.0;
                let newTopIndex = topIndex - draft.addedItems.length - 1.0;
                draft.addedItems.forEach((addedItem) => {
                    addedItem.displayIndex = newTopIndex;
                    newTopIndex = newTopIndex + 1.0;
                });
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: actionTyped.payload.type,
                        instanceId: actionTyped.payload.instanceId,
                        displayIndex: newTopIndex,
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
        }
    });
