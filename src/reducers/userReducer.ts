// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { UserState, AnyFSA } from "../types";
import { ActionGetUserPrefsSuccessAction } from "../actions/userActions";

export const userReducerInitialState = Object.freeze<UserState>({
    preferences: {
        detectBrowserDarkMode: false,
        selectedProject: null
    }
});

export const userReducer = (state: UserState = userReducerInitialState, action: AnyFSA): UserState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
                const actionTyped = action as ActionGetUserPrefsSuccessAction;
                const item = actionTyped.payload.response?.data?.item;
                draft.preferences = {
                    ...draft.preferences,
                    selectedProject: item?.settings?.selectedProject
                };
                return;
            }
        }
    });
