// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { PushOperationType } from "../../types/pushEnums";
import { PushState } from "../enums";

// interfaces/types
import { AnyFSA } from "../../types/reactHelperTypes";
import {
    ApiPostBacklogItemSuccessAction,
    ApiGetBacklogItemsSuccessAction,
    ApiGetBacklogItemSuccessAction,
    ApiDeleteBacklogItemSuccessAction
} from "../../actions/apiBacklogItems";
import { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import {
    AddNewBacklogItemFormAction,
    AddProductBacklogItemAction,
    CancelEditBacklogItemAction,
    CancelUnsavedBacklogItemAction,
    EditBacklogItemAction,
    ReceivePushedBacklogItemAction,
    RemoveProductBacklogItemAction,
    ReorderBacklogItemAction,
    SelectProductBacklogItemAction,
    ToggleBacklogItemDetailAction,
    UpdateBacklogItemAction,
    UpdateBacklogItemFieldsAction
} from "../../actions/backlogItemActions";
import { AppClickAction, AppKeyUpAction } from "../../actions/appActions";
import { BacklogItemsState, BacklogItemWithSource, SaveableBacklogItem } from "./backlogItemsReducerTypes";
import { MoveBacklogItemToSprintAction } from "../../actions/sprintBacklogActions";

// utils
import {
    getBacklogItemById,
    updateBacklogItemFieldsInItemsAndAddedItems,
    rebuildAllItems,
    updateBacklogItemFields,
    updateItemById
} from "./backlogItemsReducerHelper";
import { mapApiItemsToBacklogItems, mapApiItemToBacklogItem, mapApiStatusToBacklogItem } from "../../mappers/backlogItemMappers";
import { calcDropDownMenuState } from "../../utils/dropdownMenuUtils";
import { ApiGetBffViewsBacklogItemSuccessAction } from "../../actions/apiBffViewsBacklogItem";
import { UpdateCurrentBacklogItemFieldsAction } from "../../actions/currentBacklogItemActions";
import { BacklogItemInstanceEditableFields } from "../../components/organisms/forms/backlogItemFormTypes";
import { isoDateStringToDate } from "../../utils/apiPayloadConverters";
import { shouldHideDetailMenu } from "../../components/utils/itemDetailMenuUtils";

export const backlogItemsReducerInitialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    allItems: [],
    items: [],
    openedDetailMenuBacklogItemId: null,
    pushedItems: [],
    selectedItemIds: [],
    currentItem: null,
    savedCurrentItem: null
});

export const hasMultipleUnallocatedParts = (backlogItem: SaveableBacklogItem) => {
    return backlogItem.unallocatedParts > 1;
};

export type RemoveBacklogItemResult = {
    itemWasRemoved: boolean;
    wasUpdated: boolean;
};

export const removeBacklogItem = (
    draft: Draft<BacklogItemsState>,
    backlogItemId: string,
    unallocatedPoints?: number
): RemoveBacklogItemResult => {
    let result: RemoveBacklogItemResult = {
        itemWasRemoved: false,
        wasUpdated: false
    };
    const idx = draft.addedItems.findIndex((item) => item.id === backlogItemId);
    if (idx >= 0) {
        const backlogItem = draft.addedItems[idx];
        if (!hasMultipleUnallocatedParts(backlogItem)) {
            draft.addedItems.splice(idx, 1);
            result.itemWasRemoved = true;
        } else {
            draft.addedItems[idx].unallocatedParts--;
            draft.addedItems[idx].unallocatedPoints = unallocatedPoints;
        }
        result.wasUpdated = true;
    }
    const idx2 = draft.items.findIndex((item) => item.id === backlogItemId);
    if (idx2 >= 0) {
        const backlogItem = draft.items[idx2];
        if (!hasMultipleUnallocatedParts(backlogItem)) {
            draft.items.splice(idx2, 1);
            result.itemWasRemoved = true;
        } else {
            draft.items[idx2].unallocatedParts--;
            draft.items[idx2].unallocatedPoints = unallocatedPoints;
        }
        result.wasUpdated = true;
    }
    rebuildAllItems(draft);
    return result;
};

export const unselectProductBacklogItemId = (draft: Draft<BacklogItemsState>, backlogItemId) => {
    const itemIdx = draft.selectedItemIds.indexOf(backlogItemId);
    if (itemIdx >= 0) {
        draft.selectedItemIds.splice(itemIdx, 1);
        return true;
    }
    return false;
};

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
            case ActionTypes.ADD_BACKLOG_ITEM_FORM: {
                const actionTyped = action as AddNewBacklogItemFormAction;
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: actionTyped.payload.type,
                        instanceId: actionTyped.payload.instanceId,
                        projectId: actionTyped.payload.projectId,
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
            case ActionTypes.UPDATE_CURRENT_BACKLOG_ITEM_FIELDS:
            case ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS: {
                const updateCurrentItem = action.type === ActionTypes.UPDATE_CURRENT_BACKLOG_ITEM_FIELDS;
                if (updateCurrentItem) {
                    const actionTyped = action as UpdateCurrentBacklogItemFieldsAction;
                    updateBacklogItemFields(draft.currentItem, actionTyped.payload);
                }
                const actionTyped = action as UpdateBacklogItemFieldsAction;
                const payload = actionTyped.payload;
                updateBacklogItemFieldsInItemsAndAddedItems(draft, payload);
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
                const actionTyped = action as AppClickAction;
                const parent = actionTyped.payload.parent;
                const hideMenu = shouldHideDetailMenu(
                    parent?.dataClass,
                    parent?.itemId,
                    parent?.itemType,
                    draft.openedDetailMenuBacklogItemId
                );
                if (hideMenu) {
                    draft.openedDetailMenuBacklogItemId = null;
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
                draft.openedDetailMenuBacklogItemId = calcDropDownMenuState(
                    draft.openedDetailMenuBacklogItemId,
                    actionTyped.payload.itemId,
                    (itemId: string) => getBacklogItemById(state, itemId),
                    (item) => item.pushState !== PushState.Removed
                );
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
                const actionTyped = action as ApiDeleteBacklogItemSuccessAction;
                const id = actionTyped.meta.originalActionArgs.backlogItemId;
                removeBacklogItem(draft, id);
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
                unselectProductBacklogItemId(draft, actionTyped.payload.itemId);
                return;
            }
            case ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT: {
                const actionTyped = action as MoveBacklogItemToSprintAction;
                const backlogItemId = actionTyped.payload.sprintBacklogItem.id;
                const productBacklogItem = actionTyped.payload.productBacklogItem;
                const unallocatedPoints = productBacklogItem.unallocatedPoints;
                const { itemWasRemoved } = removeBacklogItem(draft, backlogItemId, unallocatedPoints);
                if (itemWasRemoved) {
                    unselectProductBacklogItemId(draft, backlogItemId);
                }
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.REMOVE_PRODUCT_BACKLOG_ITEM: {
                const actionTyped = action as RemoveProductBacklogItemAction;
                const backlogItemId = actionTyped.payload.backlogItemId;
                removeBacklogItem(draft, backlogItemId);
                unselectProductBacklogItemId(draft, backlogItemId);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.ADD_PRODUCT_BACKLOG_ITEM: {
                const actionTyped = action as AddProductBacklogItemAction;
                const backlogItem = actionTyped.payload.backlogItem;
                const newItem: SaveableBacklogItem = {
                    ...actionTyped.payload.backlogItem,
                    saved: true
                };
                const idxInAddedList = draft.addedItems.findIndex((item) => item.id === backlogItem.id);
                const idxInItemList = draft.items.findIndex((item) => item.id === backlogItem.id);
                if (idxInAddedList >= 0) {
                    draft.addedItems[idxInAddedList] = newItem;
                } else if (idxInItemList >= 0) {
                    draft.items[idxInItemList] = newItem;
                } else {
                    draft.items = [newItem, ...draft.items];
                }
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsBacklogItemSuccessAction;
                const backlogItems = actionTyped.payload.response.data.backlogItems;
                if (backlogItems.length === 1) {
                    const backlogItem = backlogItems[0];
                    draft.currentItem = {
                        acceptanceCriteria: backlogItem.acceptanceCriteria,
                        createdAt: isoDateStringToDate(backlogItem.createdAt),
                        editing: false,
                        estimate: backlogItem.estimate,
                        externalId: backlogItem.externalId,
                        friendlyId: backlogItem.friendlyId,
                        id: backlogItem.id,
                        instanceId: undefined,
                        projectId: backlogItem.projectId,
                        reasonPhrase: backlogItem.reasonPhrase,
                        rolePhrase: backlogItem.rolePhrase,
                        saved: true,
                        status: mapApiStatusToBacklogItem(backlogItem.status),
                        storyPhrase: backlogItem.storyPhrase,
                        type: backlogItem.type,
                        updatedAt: isoDateStringToDate(backlogItem.updatedAt),
                        startedAt: isoDateStringToDate(backlogItem.startedAt),
                        finishedAt: isoDateStringToDate(backlogItem.finishedAt),
                        acceptedAt: isoDateStringToDate(backlogItem.acceptedAt),
                        releasedAt: isoDateStringToDate(backlogItem.releasedAt),
                        partIndex: backlogItem.partIndex,
                        totalParts: backlogItem.totalParts,
                        unallocatedParts: backlogItem.unallocatedParts,
                        unallocatedPoints: backlogItem.unallocatedPoints
                    };
                    draft.savedCurrentItem = { ...draft.currentItem };
                }
                return;
            }
            case ActionTypes.RESET_CURRENT_BACKLOG_ITEM: {
                const resetItem = { ...draft.savedCurrentItem };
                draft.currentItem = resetItem;
                const item: BacklogItemInstanceEditableFields = {
                    acceptanceCriteria: resetItem.acceptanceCriteria,
                    estimate: resetItem.estimate,
                    externalId: resetItem.externalId,
                    friendlyId: resetItem.friendlyId,
                    id: resetItem.id,
                    instanceId: undefined,
                    reasonPhrase: resetItem.reasonPhrase,
                    rolePhrase: resetItem.rolePhrase,
                    storyPhrase: resetItem.storyPhrase,
                    type: resetItem.type,
                    startedAt: resetItem.startedAt,
                    finishedAt: resetItem.finishedAt,
                    acceptedAt: resetItem.acceptedAt,
                    releasedAt: resetItem.releasedAt
                };
                updateBacklogItemFieldsInItemsAndAddedItems(draft, item);
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_FAILURE: {
                // TODO: Handle failure - it may not be here though, probably needs to be at app level for message?
                return;
            }
        }
    });
};
