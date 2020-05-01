// externals
import { produce, Draft } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AppState, AnyFSA, PushNotificationType, PushNotification, BaseModelItem } from "../types";
import { EditMode } from "../components/molecules/buttons/EditButton";
import { BacklogItemModel } from "./backlogItemsReducer";
import {
    SetUsernameAction,
    SetPasswordAction,
    ActionPostLoginSuccessAction,
    ActionPostRefreshTokenSuccessAction,
    ActionPostTokenResponseBase
} from "../actions/authActions";
import { ApiActionSuccessPayload } from "../middleware/apiTypes";

const backlogItem1: BacklogItemModel = {
    creationDateTime: new Date(),
    // displayIndex: -100.0,
    estimate: 13,
    externalId: "B1000032",
    id: "920581ae222e4fa2ab24117664cda3fb",
    rolePhrase: "As a user",
    storyPhrase: "I can filter my view",
    reasonPhrase: "without it taking so long",
    type: "issue"
};

export interface BacklogItemPushNotificationData {
    itemsAdded: BacklogItemModel[];
    itemsRemoved: BaseModelItem[];
    itemsModified: BacklogItemModel[];
}

export const initialState = Object.freeze<AppState>({
    locale: "en_US",
    editMode: EditMode.View,
    executingOnClient: false,
    pushNotifications: [
        {
            type: PushNotificationType.ModifiedBacklogItems,
            data: {
                itemsAdded: [],
                itemsModified: [backlogItem1],
                itemsRemoved: []
            }
        } as PushNotification<BacklogItemPushNotificationData>
    ],
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

export const appReducer = (state: AppState = initialState, action: AnyFSA): AppState =>
    produce(state, (draft) => {
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
