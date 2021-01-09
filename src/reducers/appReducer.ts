// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { API_ACTION_STAGE_FAILURE, API_ACTION_STAGE_REQUEST, API_ACTION_STAGE_SUCCESS } from "../actions/apiActionStages";
import { EditMode } from "../components/common/componentEnums";

// interfaces/types
import { AnyFSA } from "../types";
import {
    SetUsernameAction,
    SetPasswordAction,
    ActionPostLoginSuccessAction,
    ActionPostRefreshTokenSuccessAction,
    ActionPostTokenResponseBase
} from "../actions/authActions";
import { ApiActionSuccessPayload, ApiStageAction } from "../middleware/apiTypes";
import { LocalStoreRefreshTokenAction } from "../actions/appActions";
import { ApiPostSprintBacklogItemFailureAction } from "../actions/apiSprintBacklog";

export type Locale = "en_US" | "de_DE";

export type AppState = Readonly<{
    authToken: string;
    editMode: EditMode;
    electronClient: boolean;
    executingOnClient: boolean;
    isPlanViewLoading: boolean;
    locale: Locale;
    message: string;
    password: string;
    refreshToken: string;
    username: string;
}>;

export const appReducerInitialState = Object.freeze<AppState>({
    authToken: null,
    editMode: EditMode.View,
    electronClient: false,
    executingOnClient: false,
    isPlanViewLoading: false,
    locale: "en_US",
    message: "",
    password: "",
    refreshToken: null,
    username: ""
});

const updateDraftWithTokenPayload = (draft: Draft<AppState>, payload: ApiActionSuccessPayload<ActionPostTokenResponseBase>) => {
    const authToken = payload.response.data.item.authToken;
    const refreshToken = payload.response.data.item.refreshToken;
    draft.authToken = authToken;
    draft.refreshToken = refreshToken;
};

export const appReducer = (state: AppState = appReducerInitialState, action: AnyFSA): AppState => {
    return produce(state, (draft) => {
        const actionTyped = action as ApiStageAction<{}, {}>;
        const actionStage = actionTyped.meta?.apiActionStage;
        if ((actionStage === API_ACTION_STAGE_REQUEST || actionStage === API_ACTION_STAGE_SUCCESS) && draft.message) {
            // clear message when new API request is made or successful response occurs
            draft.message = "";
        }
        if (actionStage === API_ACTION_STAGE_FAILURE) {
            const actionTyped = action as ApiPostSprintBacklogItemFailureAction;
            const apiErrorMessage = actionTyped.payload.response.message;
            const axiosErrorMessage = actionTyped.payload.error.message;
            draft.message = apiErrorMessage ? `API Error: ${apiErrorMessage}` : `Error: ${axiosErrorMessage}`;
        }

        switch (action.type) {
            case ActionTypes.SET_LOCALE: {
                const { payload } = action;
                draft.locale = payload;
                return;
            }
            case ActionTypes.SET_EDIT_MODE: {
                const { payload } = action;
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
            case ActionTypes.ERROR_PANEL_CLICK: {
                draft.message = "";
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_REQUEST: {
                draft.isPlanViewLoading = true;
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                draft.isPlanViewLoading = false;
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_FAILURE: {
                draft.isPlanViewLoading = false;
                return;
            }
        }
    });
};
