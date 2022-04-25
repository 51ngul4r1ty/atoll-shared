// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { PushOperationType } from "../../types/pushEnums";
import { PushState } from "../enums";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type {
    ApiPostBacklogItemSuccessAction,
    ApiGetBacklogItemsSuccessAction,
    ApiGetBacklogItemSuccessAction,
    ApiDeleteBacklogItemSuccessAction,
    ApiJoinUnallocatedBacklogItemPartsSuccessAction,
    ApiPostBacklogItemRequestAction,
    ApiPutBacklogItemRequestAction,
    ApiPutBacklogItemSuccessAction
} from "../../actions/apiBacklogItems";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import type {
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
import type { AppClickAction, AppKeyUpAction } from "../../actions/appActions";
import type { BacklogItemsState, BacklogItemWithSource, SaveableBacklogItem } from "./backlogItemsReducerTypes";
import type { MoveBacklogItemToSprintAction } from "../../actions/sprintBacklogActions";
import type { BacklogItemInstanceEditableFields } from "../../components/organisms/forms/backlogItemFormTypes";
import type { ApiGetBffViewsBacklogItemSuccessAction } from "../../actions/apiBffViewsBacklogItem";
import type {
    UpdateBacklogItemPartFieldAction,
    UpdateCurrentBacklogItemFieldsAction
} from "../../actions/currentBacklogItemActions";
import type {
    CancelEditBacklogItemPartAction,
    EditBacklogItemPartAction,
    ToggleBacklogItemPartDetailAction,
    UpdateBacklogItemPartAction
} from "../../actions/backlogItemPartActions";
import type { ApiGetBacklogItemPartSuccessAction } from "../../actions/apiBacklogItemParts";
import type { ApiBacklogItem, ApiSprint } from "../../types/apiModelTypes";
import type { ApiSplitSprintItemSuccessAction } from "../../actions/apiSprintBacklog";

// selectors
import * as backlogItemsSliceSelectors from "./backlogItemsSliceSelectors";

// utils
import {
    rebuildAllItems,
    turnOffEditModeForBacklogItemPart,
    updateBacklogItemFields,
    updateBacklogItemFieldsInItemsAndAddedItems,
    updateCurrentItemPartById,
    updateItemById,
    updateItemByInstanceId
} from "./backlogItemsReducerHelper";
import {
    mapApiItemsToBacklogItems,
    mapApiItemsToEditableBacklogItems,
    mapApiItemToBacklogItem
} from "../../mappers/backlogItemMappers";
import { mapApiStatusToBacklogItem } from "../../mappers/statusMappers";
import { calcToggledOpenMenuItemId } from "../../utils/dropdownMenuUtils";
import { isoDateStringToDate } from "../../utils/apiPayloadConverters";
import { shouldHideDetailMenu } from "../../components/utils/itemDetailMenuUtils";
import { mapApiItemToBacklogItemPart } from "../../mappers/backlogItemPartMappers";
import { mapApiItemToSprint } from "../../mappers";

export const backlogItemsReducerInitialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    allItems: [],
    items: [],
    openedDetailMenuBacklogItemId: null,
    openedDetailMenuBacklogItemPartId: null,
    pushedItems: [],
    selectedItemIds: [],
    currentItem: null,
    currentItemPartsAndSprints: [],
    savedCurrentItem: null,
    joinUnallocatedPartsInProgress: false
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

export const unselectProductBacklogItemId = (draft: Draft<BacklogItemsState>, backlogItemId: string): boolean => {
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
                draft.items = mapApiItemsToEditableBacklogItems(payload.response.data.items);
                draft.pushedItems = [];
                draft.addedItems = [];
                return rebuildAllItems(draft);
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToEditableBacklogItems(payload.response.data.backlogItems);
                draft.pushedItems = [];
                draft.addedItems = [];
                return rebuildAllItems(draft);
            }
            case ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemSuccessAction;
                return handleFetchedBacklogItem(draft, actionTyped.payload.response.data.item);
            }
            case ActionTypes.API_POST_BACKLOG_ITEM_REQUEST: {
                const actionTyped = action as ApiPostBacklogItemRequestAction;
                const instanceId = actionTyped.meta.instanceId;
                const changed = updateItemByInstanceId(draft, instanceId, (item) => {
                    item.saving = true;
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
                return;
            }
            case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiPostBacklogItemSuccessAction;
                const { payload, meta } = actionTyped;
                const updatedBacklogItem = payload.response.data.item;
                const instanceId = meta.instanceId;
                const changed = updateItemByInstanceId(draft, instanceId, (addedItem) => {
                    addedItem.id = updatedBacklogItem.id;
                    addedItem.friendlyId = updatedBacklogItem.friendlyId;
                    addedItem.saved = true;
                    addedItem.saving = false;
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
                const actionTyped = action as ApiSplitSprintItemSuccessAction;
                const totalParts = actionTyped.payload.response.data.extra.backlogItem.totalParts;
                const backlogItemId = actionTyped.payload.response.data.extra.backlogItem.id;
                const changed = updateItemById(draft, backlogItemId, (item) => {
                    item.totalParts = totalParts;
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
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
                return rebuildAllItems(draft);
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
                return rebuildAllItems(draft);
            }
            case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM: {
                const actionTyped = action as CancelEditBacklogItemAction;
                updateItemById(draft, actionTyped.payload.itemId, (item) => {
                    item.editing = false;
                });
                return rebuildAllItems(draft);
            }
            case ActionTypes.API_PUT_BACKLOG_ITEM_REQUEST: {
                const actionTyped = action as ApiPutBacklogItemRequestAction;
                const backlogItemId = actionTyped.payload.request.id;
                const changed = updateItemById(draft, backlogItemId, (item) => {
                    item.saving = true;
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
                return;
            }
            case ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiPutBacklogItemSuccessAction;
                const backlogItemId = actionTyped.payload.response.data.item.id;
                const changed = updateItemById(draft, backlogItemId, (item) => {
                    item.editing = false;
                    item.saving = false;
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
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
                return updateBacklogItemFieldsInItemsAndAddedItems(draft, payload);
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
                return rebuildAllItems(draft);
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
                const strictMode = actionTyped.payload.strictMode;
                const getItem = (itemId: string) => backlogItemsSliceSelectors.sliceSelectBacklogItemById(state, itemId);
                const includeItemCheck = (item) => item.pushState !== PushState.Removed;
                draft.openedDetailMenuBacklogItemId = calcToggledOpenMenuItemId(
                    draft.openedDetailMenuBacklogItemId,
                    actionTyped.payload.itemId,
                    strictMode,
                    getItem,
                    includeItemCheck
                );
                return;
            }
            case ActionTypes.TOGGLE_BACKLOG_ITEM_PART_DETAIL: {
                const actionTyped = action as ToggleBacklogItemPartDetailAction;
                const strictMode = actionTyped.payload.strictMode;
                draft.openedDetailMenuBacklogItemPartId = calcToggledOpenMenuItemId(
                    draft.openedDetailMenuBacklogItemPartId,
                    actionTyped.payload.partId,
                    strictMode
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
            case ActionTypes.EDIT_BACKLOG_ITEM_PART: {
                const actionTyped = action as EditBacklogItemPartAction;
                updateCurrentItemPartById(draft, actionTyped.payload.itemId, (item) => {
                    item.state.editable = true;
                });
                draft.openedDetailMenuBacklogItemPartId = null;
                return;
            }
            case ActionTypes.CANCEL_EDIT_BACKLOG_ITEM_PART: {
                const actionTyped = action as CancelEditBacklogItemPartAction;
                return turnOffEditModeForBacklogItemPart(draft, actionTyped.payload.itemId);
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM_PART: {
                const actionTyped = action as UpdateBacklogItemPartAction;
                return turnOffEditModeForBacklogItemPart(draft, actionTyped.payload.id);
            }
            case ActionTypes.API_GET_BACKLOG_ITEM_PART_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemPartSuccessAction;
                const apiBacklogItemPart = actionTyped.payload.response.data.item;
                const backlogItemPart = mapApiItemToBacklogItemPart(apiBacklogItemPart);
                return updateCurrentItemPartById(draft, apiBacklogItemPart.id, (item) => {
                    item.part = {
                        ...item.part,
                        externalId: backlogItemPart.externalId,
                        percentage: backlogItemPart.percentage,
                        points: backlogItemPart.points,
                        startedAt: backlogItemPart.startedAt,
                        finishedAt: backlogItemPart.finishedAt
                    };
                });
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
                return rebuildAllItems(draft);
            }
            case ActionTypes.REMOVE_PRODUCT_BACKLOG_ITEM: {
                const actionTyped = action as RemoveProductBacklogItemAction;
                const backlogItemId = actionTyped.payload.backlogItemId;
                removeBacklogItem(draft, backlogItemId);
                unselectProductBacklogItemId(draft, backlogItemId);
                return rebuildAllItems(draft);
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
                return rebuildAllItems(draft);
            }
            case ActionTypes.UPDATE_BACKLOG_ITEM_PART_FIELD: {
                const actionTyped = action as UpdateBacklogItemPartFieldAction;
                const partId = actionTyped.payload.partId;
                const matchingPartAndSprint = draft.currentItemPartsAndSprints.filter(
                    (partAndSprint) => partAndSprint.part.id === partId
                );
                switch (actionTyped.payload.fieldName) {
                    case "points": {
                        const fieldValue = actionTyped.payload.fieldValue;
                        const points = fieldValue ? parseFloat(fieldValue) : null;
                        matchingPartAndSprint[0].part.points = points;
                        const totalPoints = draft.currentItem.estimate;
                        matchingPartAndSprint[0].part.percentage = Math.trunc((points / totalPoints) * 100);
                        break;
                    }
                    default: {
                        break;
                    }
                }
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsBacklogItemSuccessAction;
                const backlogItem = actionTyped.payload.response.data.backlogItem;
                const partsAndSprints = actionTyped.payload.response.data.backlogItemPartsAndSprints;
                const buildSprintFromApiItem = (apiSprint: ApiSprint) => {
                    const baseSprint = mapApiItemToSprint(apiSprint);
                    const result = {
                        ...baseSprint,
                        expanded: false // don't expand any of them in the backlog item view
                    };
                    return result;
                };
                draft.currentItemPartsAndSprints = partsAndSprints.map((item) => ({
                    part: mapApiItemToBacklogItemPart(item.part),
                    sprint: buildSprintFromApiItem(item.sprint),
                    state: {
                        editable: false
                    }
                }));
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
                    unallocatedPoints: backlogItem.unallocatedPoints,
                    saving: false
                };
                draft.savedCurrentItem = { ...draft.currentItem };
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
                return updateBacklogItemFieldsInItemsAndAddedItems(draft, item);
            }
            case ActionTypes.API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_REQUEST: {
                draft.joinUnallocatedPartsInProgress = true;
                return;
            }
            case ActionTypes.API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_FAILURE: {
                draft.joinUnallocatedPartsInProgress = false;
                return;
            }
            case ActionTypes.API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_SUCCESS: {
                const actionTyped = action as ApiJoinUnallocatedBacklogItemPartsSuccessAction;
                draft.joinUnallocatedPartsInProgress = false;
                handleFetchedBacklogItem(draft, actionTyped.payload.response.data.item);
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_FAILURE: {
                // TODO: Handle failure - it may not be here though, probably needs to be at app level for message?
                return;
            }
        }
    });
};

const handleFetchedBacklogItem = (draft: Draft<BacklogItemsState>, payloadBacklogItem: ApiBacklogItem): void => {
    const backlogItem = mapApiItemToBacklogItem(payloadBacklogItem);
    const newItems = [];
    draft.items.forEach((item) => {
        if (item.id === backlogItem.id) {
            item = { ...item, ...backlogItem };
        }
        newItems.push(item);
    });
    draft.items = newItems;
    rebuildAllItems(draft);
};
