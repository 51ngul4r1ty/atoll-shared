// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";
import { ActionGetUserPrefsSuccessAction } from "../actions/apiUserActions";
import { UserSettings } from "../types/apiModelTypes";
import { SetCurrentProjectIdAction } from "../actions/userPrefsActions";

export type UserState = Readonly<{
    preferences: UserSettings;
}>;

export const userReducerInitialState = Object.freeze<UserState>({
    preferences: {
        detectBrowserDarkMode: false,
        selectedProject: null,
        selectedSprint: null
    }
});

export const userReducer = (state: UserState = userReducerInitialState, action: AnyFSA): UserState =>
    produce(state, (draft) => {
        const { type } = action;

        switch (type) {
            case ActionTypes.API_GET_USER_PREFS_SUCCESS: {
                const actionTyped = action as ActionGetUserPrefsSuccessAction;
                const item = actionTyped.payload.response?.data?.item;
                draft.preferences = {
                    ...draft.preferences,
                    selectedProject: item?.settings?.selectedProject,
                    selectedSprint: item?.settings?.selectedSprint,
                    detectBrowserDarkMode: item?.settings?.detectBrowserDarkMode
                };
                return;
            }
            case ActionTypes.SET_CURRENT_PROJECT_ID: {
                const actionTyped = action as SetCurrentProjectIdAction;
                draft.preferences.selectedProject = actionTyped.payload.projectId;
                return;
            }
        }
    });
