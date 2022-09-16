// actions
import * as ActionTypes from "./actionTypes";

// interfaces/types
import type { BacklogItemInstanceEditableFields } from "../components/organisms/forms/backlogItemFormTypes";
import type { BacklogItemType } from "../types/backlogItemTypes";
import type { BacklogItemWithSource } from "../reducers/backlogItems/backlogItemsReducerTypes";
import type { WebsocketPushNotificationData } from "../types/pushTypes";

// actions
import { apiGetBacklogItems } from "./apiBacklogItems";

export const refreshBacklogItems = (projectId: string) => apiGetBacklogItems(projectId);

let lastInstanceId = 0;

export interface AddNewBacklogItemFormActionPayload {
    type: BacklogItemType;
    instanceId: number;
    projectId: string;
}
export interface AddNewBacklogItemFormAction {
    type: typeof ActionTypes.ADD_BACKLOG_ITEM_FORM;
    payload: AddNewBacklogItemFormActionPayload;
}
export const addNewBacklogItemForm = (type: BacklogItemType, projectId: string): AddNewBacklogItemFormAction => ({
    type: ActionTypes.ADD_BACKLOG_ITEM_FORM,
    payload: {
        type,
        instanceId: ++lastInstanceId,
        projectId
    }
});

export interface CancelUnsavedBacklogItemActionPayload {
    instanceId: number;
}
export interface CancelUnsavedBacklogItemAction {
    type: typeof ActionTypes.CANCEL_UNSAVED_BACKLOG_ITEM;
    payload: CancelUnsavedBacklogItemActionPayload;
}
export const cancelUnsavedBacklogItem = (instanceId: number): CancelUnsavedBacklogItemAction => ({
    type: ActionTypes.CANCEL_UNSAVED_BACKLOG_ITEM,
    payload: {
        instanceId
    }
});

export interface CancelEditBacklogItemActionPayload {
    itemId: string;
}
export interface CancelEditBacklogItemAction {
    type: typeof ActionTypes.CANCEL_EDIT_BACKLOG_ITEM;
    payload: CancelEditBacklogItemActionPayload;
}
export const cancelEditBacklogItem = (itemId: string): CancelEditBacklogItemAction => ({
    type: ActionTypes.CANCEL_EDIT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});

export interface SaveNewBacklogItemActionPayload {
    instanceId: number;
}
export interface SaveNewBacklogItemAction {
    type: typeof ActionTypes.SAVE_NEW_BACKLOG_ITEM;
    payload: SaveNewBacklogItemActionPayload;
}
export const saveNewBacklogItem = (instanceId: number): SaveNewBacklogItemAction => ({
    type: ActionTypes.SAVE_NEW_BACKLOG_ITEM,
    payload: {
        instanceId
    }
});

export interface UpdateBacklogItemActionPayload {
    id: string;
}
export interface UpdateBacklogItemAction {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM;
    payload: UpdateBacklogItemActionPayload;
}
export const updateBacklogItem = (id: string): UpdateBacklogItemAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM,
    payload: {
        id
    }
});

export interface UpdateBacklogItemFieldsAction {
    type: typeof ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS;
    payload: BacklogItemInstanceEditableFields;
}
export const updateBacklogItemFields = (fields: BacklogItemInstanceEditableFields): UpdateBacklogItemFieldsAction => ({
    type: ActionTypes.UPDATE_BACKLOG_ITEM_FIELDS,
    payload: fields
});

export interface ReceivePushedBacklogItemAction<T = any> {
    type: typeof ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM;
    payload: WebsocketPushNotificationData<T>;
}
export const receivePushedBacklogItem = <T = any>(item: WebsocketPushNotificationData<T>): ReceivePushedBacklogItemAction<T> => {
    return {
        type: ActionTypes.RECEIVE_PUSHED_BACKLOG_ITEM,
        payload: item
    };
};

export interface ReorderBacklogItemPayload {
    sourceItemId: string;
    targetItemId: string;
}
export interface ReorderBacklogItemAction {
    type: typeof ActionTypes.REORDER_BACKLOG_ITEM;
    payload: ReorderBacklogItemPayload;
}
export const reorderBacklogItems = (sourceItemId: string, targetItemId: string): ReorderBacklogItemAction => ({
    type: ActionTypes.REORDER_BACKLOG_ITEM,
    payload: {
        sourceItemId,
        targetItemId
    }
});

export interface ToggleBacklogItemDetailPayload {
    itemId: string;
    strictMode: boolean;
}

export interface ToggleBacklogItemDetailAction {
    type: typeof ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL;
    payload: ToggleBacklogItemDetailPayload;
}

export const backlogItemDetailClick = (itemId: string, strictMode: boolean): ToggleBacklogItemDetailAction => ({
    type: ActionTypes.TOGGLE_BACKLOG_ITEM_DETAIL,
    payload: {
        itemId,
        strictMode
    }
});

export interface BacklogItemIdClickPayload {
    backlogItemId: string;
}

export interface BacklogItemIdClickAction {
    type: typeof ActionTypes.BACKLOG_ITEM_ID_CLICK;
    payload: BacklogItemIdClickPayload;
}

export const backlogItemIdClick = (backlogItemId: string): BacklogItemIdClickAction => ({
    type: ActionTypes.BACKLOG_ITEM_ID_CLICK,
    payload: {
        backlogItemId
    }
});

export interface EditBacklogItemPayload {
    itemId: string;
}

export interface EditBacklogItemAction {
    type: typeof ActionTypes.EDIT_BACKLOG_ITEM;
    payload: EditBacklogItemPayload;
}

export const editBacklogItem = (itemId: string): EditBacklogItemAction => ({
    type: ActionTypes.EDIT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});

export interface SelectOrUnselectProductBacklogItemPayload {
    itemId: string;
}

export interface SelectProductBacklogItemAction {
    type: typeof ActionTypes.SELECT_PRODUCT_BACKLOG_ITEM;
    payload: SelectOrUnselectProductBacklogItemPayload;
}
export const selectProductBacklogItem = (itemId: string): SelectProductBacklogItemAction => ({
    type: ActionTypes.SELECT_PRODUCT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});

export interface UnselectProductBacklogItemAction {
    type: typeof ActionTypes.UNSELECT_PRODUCT_BACKLOG_ITEM;
    payload: SelectOrUnselectProductBacklogItemPayload;
}
export const unselectProductBacklogItem = (itemId: string): UnselectProductBacklogItemAction => ({
    type: ActionTypes.UNSELECT_PRODUCT_BACKLOG_ITEM,
    payload: {
        itemId
    }
});

export interface AddProductBacklogItemPayload {
    backlogItem: BacklogItemWithSource;
}
export interface AddProductBacklogItemAction {
    type: typeof ActionTypes.ADD_PRODUCT_BACKLOG_ITEM;
    payload: AddProductBacklogItemPayload;
}
export const addProductBacklogItem = (backlogItem: BacklogItemWithSource) => ({
    type: ActionTypes.ADD_PRODUCT_BACKLOG_ITEM,
    payload: {
        backlogItem
    }
});

export type RemoveProductBacklogItemPayload = {
    backlogItemId: string;
};
export type RemoveProductBacklogItemAction = {
    type: typeof ActionTypes.REMOVE_PRODUCT_BACKLOG_ITEM;
    payload: RemoveProductBacklogItemPayload;
};
export const removeProductBacklogItem = (backlogItemId: string): RemoveProductBacklogItemAction => ({
    type: ActionTypes.REMOVE_PRODUCT_BACKLOG_ITEM,
    payload: {
        backlogItemId
    }
});
