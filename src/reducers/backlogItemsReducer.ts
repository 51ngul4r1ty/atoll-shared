// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { BacklogItemsState, AnyFSA, BacklogItem } from "../types";

export const initialState = Object.freeze<BacklogItemsState>({
    addedItems: [],
    items: []
});

export const backlogItemsReducer = (state: BacklogItemsState = initialState, action: AnyFSA): BacklogItemsState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                draft.items = payload.response.data.items;
                return;
            }
            case ActionTypes.ADD_BACKLOGITEM: {
                draft.addedItems = [
                    ...draft.addedItems,
                    {
                        type: payload.type
                    } as BacklogItem
                ];
            }
        }
    });
