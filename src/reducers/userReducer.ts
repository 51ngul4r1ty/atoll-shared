// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { UserState, AnyFSA } from "../types";

export const initialState = Object.freeze<UserState>({
    preferences: {
        detectBrowserDarkMode: false
    }
});

export const userReducer = (state: UserState = initialState, action: AnyFSA): UserState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
                draft.preferences = { ...draft.preferences, ...payload.response.data };
                return;
            }
        }
    });
