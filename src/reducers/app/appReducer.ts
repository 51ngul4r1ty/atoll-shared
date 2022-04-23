// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { API_ACTION_STAGE_FAILURE, API_ACTION_STAGE_REQUEST, API_ACTION_STAGE_SUCCESS } from "../../actions/apiActionStages";
import { EditMode } from "../../components/common/componentEnums";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type { ApiActionSuccessPayload, ApiStageAction } from "../../middleware/apiTypes";
import type { ApiPostSprintBacklogItemFailureAction } from "../../actions/apiSprintBacklog";

// actions
import {
    SetUsernameAction,
    SetPasswordAction,
    ActionPostLoginSuccessAction,
    ActionPostRefreshTokenSuccessAction,
    ActionPostTokenResponseBase
} from "../../actions/authActions";
import { LocalStoreRefreshTokenAction } from "../../actions/appActions";

// utils
import { timeNow } from "../../utils/dateHelper";
import { getStrictModeFromBrowserUrl } from "./appReducerHelper";

export type Locale = "en_US" | "de_DE";

export type AppState = Readonly<{
    authToken: string;
    editMode: EditMode;
    electronClient: boolean;
    executingOnClient: boolean;
    isPlanViewLoading: boolean;
    isPlanViewError: boolean;
    locale: Locale;
    message: string;
    password: string;
    postLoginReturnRoute: string;
    postLoginReturnRouteSetAt: Date | undefined;
    refreshToken: string;
    username: string;
    isStrictMode: boolean; // typically only turned on during development to catch issues
}>;

export const appReducerInitialState = Object.freeze<AppState>({
    authToken: null,
    editMode: EditMode.View,
    electronClient: false,
    executingOnClient: false,
    isPlanViewLoading: false,
    isPlanViewError: false,
    locale: "en_US",
    message: "",
    password: "",
    postLoginReturnRoute: "",
    postLoginReturnRouteSetAt: undefined,
    refreshToken: null,
    username: "",
    isStrictMode: false
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
            const apiErrorMessage = actionTyped.payload.response?.message || null;
            const axiosErrorMessage = actionTyped.payload.error?.message || "(no error provided by axios)";
            draft.message = apiErrorMessage ? `API Error: ${apiErrorMessage}` : `Error: ${axiosErrorMessage}`;
        }

        switch (action.type) {
            case ActionTypes.INIT_APP: {
                draft.isStrictMode = getStrictModeFromBrowserUrl();
                return;
            }
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
                draft.isPlanViewError = false;
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                draft.isPlanViewLoading = false;
                draft.isPlanViewError = false;
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_FAILURE: {
                draft.isPlanViewLoading = false;
                draft.isPlanViewError = true;
                return;
            }
            case ActionTypes.STORE_RETURN_ROUTE: {
                draft.postLoginReturnRoute = action.payload || "";
                draft.postLoginReturnRouteSetAt = timeNow();
                return;
            }
            case ActionTypes.CLEAR_RETURN_ROUTE: {
                draft.postLoginReturnRoute = "";
                draft.postLoginReturnRouteSetAt = timeNow();
                return;
            }
        }
    });
};
