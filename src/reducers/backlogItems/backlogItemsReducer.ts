// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";

// interfaces/types
import { AnyFSA, PushOperationType } from "../../types";
import {
    ApiPostBacklogItemSuccessAction,
    ApiDeleteBacklogItemAction,
    ApiGetBacklogItemsSuccessAction,
    ApiGetBacklogItemSuccessAction
} from "../../actions/apiBacklogItems";
import { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import {
    AddNewBacklogItemAction,
    UpdateBacklogItemFieldsAction,
    CancelUnsavedBacklogItemAction,
    ReceivePushedBacklogItemAction,
    ReorderBacklogItemAction,
    ToggleBacklogItemDetailAction,
    EditBacklogItemAction,
    CancelEditBacklogItemAction,
    UpdateBacklogItemAction,
    SelectProductBacklogItemAction
} from "../../actions/backlogItemActions";
import { AppClickAction, AppKeyUpAction } from "../../actions/appActions";
import { BacklogItemsState, BacklogItemWithSource, PushState, SaveableBacklogItem } from "./backlogItemsReducerTypes";
import {
    getBacklogItemById,
    idsMatch,
    rebuildAllItems,
    targetIsInMenuButton,
    targetIsInMenuPanel,
    updateBacklogItemFields,
    updateItemById,
    updateItemFieldsInAllItems
} from "./backlogItemsReducerHelper";
import { mapApiItemsToBacklogItems, mapApiItemToBacklogItem } from "../../mappers/backlogItemMappers";

export const backlogItemsReducerInitialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    pushedItems: [],
    items: [],
    allItems: [],
    selectedItemIds: [],
    openedDetailMenuBacklogItemId: null
});

export const backlogItemsReducer = (
    state: BacklogItemsState = backlogItemsReducerInitialState,
    action: AnyFSA
): BacklogItemsState => {
    return produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemsSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToBacklogItems(payload.response.data.items);
                draft.pushedItems = [];
                draft.addedItems = [];
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToBacklogItems(payload.response.data.backlogItems);
                draft.pushedItems = [];
                draft.addedItems = [];
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemSuccessAction;
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
                        addedItem.friendlyId = updatedBacklogItem.friendlyId;
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
                if (actionTyped.payload.operation === PushOperationType.Removed) {
                    const removedItemId = actionTyped.payload.item.id;
                    if (draft.openedDetailMenuBacklogItemId === removedItemId) {
                        // close the menu for the deleted item - it isn't possible to use any of the actions available now
                        draft.openedDetailMenuBacklogItemId = null;
                    }
                }
                draft.pushedItems.push(actionTyped.payload);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.APP_CLICK: {
                if (draft.openedDetailMenuBacklogItemId) {
                    const actionTyped = action as AppClickAction;
                    const targetElt = actionTyped.payload.target;
                    if (!targetIsInMenuPanel(targetElt) && !targetIsInMenuButton(targetElt)) {
                        draft.openedDetailMenuBacklogItemId = null;
                    }
                }
                return;
            }
            case ActionTypes.APP_KEYUP: {
                if (draft.openedDetailMenuBacklogItemId) {
                    const actionTyped = action as AppKeyUpAction;
                    if (actionTyped.payload.keyCode === 27) {
                        draft.openedDetailMenuBacklogItemId = null;
                    }
                }
                return;
            }
            case ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as ToggleBacklogItemDetailAction;
                let openItemId: string;
                if (draft.openedDetailMenuBacklogItemId === null) {
                    openItemId = actionTyped.payload.itemId;
                } else if (draft.openedDetailMenuBacklogItemId === actionTyped.payload.itemId) {
                    openItemId = null;
                } else {
                    openItemId = actionTyped.payload.itemId;
                    draft.openedDetailMenuBacklogItemId = actionTyped.payload.itemId;
                }
                if (openItemId) {
                    const backlogItem = getBacklogItemById(state, openItemId);
                    if (backlogItem.pushState === PushState.Removed) {
                        // do not allow this menu to be shown when the item has been deleted
                        openItemId = null;
                    }
                }
                draft.openedDetailMenuBacklogItemId = openItemId;
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
                const actionTyped = action as ApiDeleteBacklogItemAction;
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
            case ActionTypes.SELECT_PRODUCT_BACKLOG_ITEM: {
                const actionTyped = action as SelectProductBacklogItemAction;
                const itemIdx = draft.selectedItemIds.indexOf(actionTyped.payload.itemId);
                if (itemIdx >= 0) {
                    draft.selectedItemIds.splice(itemIdx, 1);
                }
                draft.selectedItemIds.push(actionTyped.payload.itemId);
                return;
            }
            case ActionTypes.UNSELECT_PRODUCT_BACKLOG_ITEM: {
                const actionTyped = action as SelectProductBacklogItemAction;
                const itemIdx = draft.selectedItemIds.indexOf(actionTyped.payload.itemId);
                if (itemIdx >= 0) {
                    draft.selectedItemIds.splice(itemIdx, 1);
                }
                return;
            }
        }
    });
};
