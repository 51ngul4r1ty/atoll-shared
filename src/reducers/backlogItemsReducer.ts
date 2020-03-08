// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { AddNewBacklogItemAction, UpdateBacklogItemFieldsAction } from "../actions/backlogItems";

export type BacklogItemType = "story" | "issue";

export interface BacklogItem {
    creationDateTime: Date;
    displayIndex: number;
    estimate: number | null;
    externalId: string | null;
    id: number;
    instanceId: number | null;
    reasonPhrase: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    type: BacklogItemType;
}

export type BacklogItemsState = Readonly<{
    addedItems: BacklogItem[];
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
            case ActionTypes.ADD_BACKLOG_ITEM: {
                const actionTyped = action as AddNewBacklogItemAction;
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: actionTyped.payload.type,
                        instanceId: actionTyped.payload.instanceId
                    } as BacklogItem
                ];
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS: {
                const actionTyped = action as UpdateBacklogItemFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === actionTyped.payload.instanceId) {
                        addedItem.estimate = actionTyped.payload.estimate;
                    }
                });
                return;
            }
        }
    });
