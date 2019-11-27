// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { BacklogItemsState, AnyFSA } from "../types";

export const initialState = Object.freeze<BacklogItemsState>({
    items: []
});

export default (state: BacklogItemsState = initialState, action: AnyFSA): BacklogItemsState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                draft.items = payload.response.data.items;
                return;
            }
        }
    });
