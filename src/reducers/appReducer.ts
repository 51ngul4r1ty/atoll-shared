// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AppState, AnyFSA, PushNotificationType, PushNotification, BaseModelItem } from "../types";
import { EditMode } from "../components/molecules/buttons/EditButton";
import { BacklogItemModel } from "./backlogItemsReducer";

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
    ]
});

export const appReducer = (state: AppState = initialState, action: AnyFSA): AppState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.SET_LOCALE: {
                draft.locale = payload;
                return;
            }
            case ActionTypes.SET_EDIT_MODE: {
                draft.editMode = payload;
                return;
            }
        }
    });
