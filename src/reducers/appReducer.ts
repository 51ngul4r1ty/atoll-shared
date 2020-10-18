// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { EditMode } from "../components/molecules/buttons/EditButton";
import {
    SetUsernameAction,
    SetPasswordAction,
    ActionPostLoginSuccessAction,
    ActionPostRefreshTokenSuccessAction,
    ActionPostTokenResponseBase
} from "../actions/authActions";
import { ApiActionSuccessPayload } from "../middleware/apiTypes";
import { LocalStoreRefreshTokenAction } from "../actions/appActions";

export type Locale = "en_US" | "de_DE";

export type AppState = Readonly<{
    authToken: string;
    editMode: EditMode;
    electronClient: boolean;
    executingOnClient: boolean;
    locale: Locale;
    password: string;
    refreshToken: string;
    username: string;
}>;

export const appReducerInitialState = Object.freeze<AppState>({
    locale: "en_US",
    editMode: EditMode.View,
    electronClient: false,
    executingOnClient: false,
    username: "",
    password: "",
    authToken: null,
    refreshToken: null
});

const updateDraftWithTokenPayload = (draft: Draft<AppState>, payload: ApiActionSuccessPayload<ActionPostTokenResponseBase>) => {
    const authToken = payload.response.data.item.authToken;
    const refreshToken = payload.response.data.item.refreshToken;
    draft.authToken = authToken;
    draft.refreshToken = refreshToken;
};

export const appReducer = (state: AppState = appReducerInitialState, action: AnyFSA): AppState => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ActionTypes.SET_LOCALE: {
                const { type, payload } = action;
                draft.locale = payload;
                return;
            }
            case ActionTypes.SET_EDIT_MODE: {
                const { type, payload } = action;
                draft.editMode = payload;
                return;
            }
            case ActionTypes.SET_USERNAME: {
                const actionTyped = action as SetUsernameAction;
                draft.username = actionTyped.payload;
                return;
            }
            case ActionTypes.SET_PASSWORD: {
                const actionTyped = action as SetPasswordAction;
                draft.password = actionTyped.payload;
                return;
            }
            case ActionTypes.LOCAL_STORE_REFRESH_TOKEN: {
                const actionTyped = action as LocalStoreRefreshTokenAction;
                draft.refreshToken = actionTyped.payload.refreshToken;
                return;
            }
            case ActionTypes.API_POST_ACTION_LOGIN_SUCCESS: {
                const actionTyped = action as ActionPostLoginSuccessAction;
                updateDraftWithTokenPayload(draft, actionTyped.payload);
                return;
            }
            case ActionTypes.API_POST_ACTION_RETRY_TOKEN_SUCCESS: {
                const actionTyped = action as ActionPostRefreshTokenSuccessAction;
                updateDraftWithTokenPayload(draft, actionTyped.payload);
                return;
            }
        }
    });
};
