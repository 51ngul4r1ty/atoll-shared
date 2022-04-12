// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import type { AnyFSA } from "../types/reactHelperTypes";
import type { BaseModelItem } from "../types/dataModelTypes";
import type { ApiProductBacklogItem } from "../types/apiModelTypes";
import type { ApiGetProductBacklogItemsSuccessAction } from "../actions/apiProductBacklogItems";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

export interface ProductBacklogItem extends BaseModelItem {
    id: string;
    projectId: string | null;
    backlogItemId: string | null;
    nextBacklogItemId: string | null;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

export type ProductBacklogItemsState = Readonly<{
    items: ProductBacklogItem[];
}>;

export const productBacklogItemsReducerInitialState = Object.freeze<ProductBacklogItemsState>({
    items: []
});

export const mapApiItemToProductBacklogItem = (apiItem: ApiProductBacklogItem): ProductBacklogItem => ({
    id: apiItem.id,
    projectId: apiItem.projectId,
    backlogItemId: apiItem.backlogitemId,
    nextBacklogItemId: apiItem.nextbacklogitemId,
    createdAt: isoDateStringToDate(apiItem.createdAt),
    updatedAt: isoDateStringToDate(apiItem.updatedAt),
    version: apiItem.version
});

export const mapApiItemsToProductBacklogItems = (apiItems: ApiProductBacklogItem[]): ProductBacklogItem[] => {
    return apiItems.map((item) => mapApiItemToProductBacklogItem(item));
};

export const productBacklogItemsReducer = (
    state: ProductBacklogItemsState = productBacklogItemsReducerInitialState,
    action: AnyFSA
): ProductBacklogItemsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEM_RANKS_SUCCESS: {
                const actionTyped = action as ApiGetProductBacklogItemsSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToProductBacklogItems(payload.response.data.items);
                return;
            }
        }
    });
