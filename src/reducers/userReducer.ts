// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { UserState, AnyFSA } from "../types";

export const userReducerInitialState = Object.freeze<UserState>({
    preferences: {
        detectBrowserDarkMode: false
    }
});

export const userReducer = (state: UserState = userReducerInitialState, action: AnyFSA): UserState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
                draft.preferences = { ...draft.preferences, ...payload.response.data.item };
                return;
            }
        }
    });
