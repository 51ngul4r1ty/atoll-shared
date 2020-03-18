// externals
import { Action, Dispatch } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// utils
import * as wsClient from "../utils/wsClient";

// interfaces/types
import { ApiPostBacklogItemSuccessAction, receivePushedBacklogItem } from "../actions/backlogItems";
import { PushNotification, PushNotificationType } from "../types";
import { ReceiveWebsocketMessageAction } from "../actions/wsActions";
import { BacklogItemModel } from "../reducers/backlogItemsReducer";

const pushBacklogItemSaved = (item: BacklogItemModel) => {
    const payload: PushNotification<BacklogItemModel> = {
        type: PushNotificationType.ModifiedBacklogItems,
        data: item
    };
    wsClient.send(payload);
};

export const wsMiddleware = (store) => (next) => (action: Action) => {
    const dispatch = store.dispatch as Dispatch<any>;
    next(action);
    switch (action.type) {
        case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiPostBacklogItemSuccessAction;
            if (actionTyped.payload.response?.status === 201) {
                const item = actionTyped.payload.response.data?.item;
                pushBacklogItemSaved(item);
            }
            break;
        }
        case ActionTypes.RECEIVE_WEBSOCKET_MESSAGE: {
            const actionTyped = action as ReceiveWebsocketMessageAction;
            const msgDecoded = JSON.parse(actionTyped.payload || "{}");
            if (msgDecoded.type === PushNotificationType.ModifiedBacklogItems) {
                dispatch(receivePushedBacklogItem(msgDecoded.data || {}));
            }
            break;
        }
    }
};
