// externals
import { Action, Dispatch, Middleware } from "redux";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";
import { PushNotificationType, PushOperationType } from "../types/pushEnums";

// utils
import * as wsClient from "../utils/wsClient";
import { mapApiItemToBacklogItem } from "../mappers/backlogItemMappers";

// interfaces/types
import type {
    ApiPostBacklogItemSuccessAction,
    ApiDeleteBacklogItemSuccessAction,
    ApiPutBacklogItemSuccessAction
} from "../actions/apiBacklogItems";
import type { WebsocketPushNotification, WebsocketPushNotificationV0, WebsocketPushNotificationData } from "../types/pushTypes";
import type { ReceiveWebsocketMessageAction } from "../actions/wsActions";
import type { BacklogItemModel } from "../types/backlogItemTypes";
import type { StateTree } from "../reducers/rootReducer";

// actions
import { receivePushedBacklogItem } from "../actions/backlogItemActions";

// selectors
import { getPrevNextAndCurrentById } from "../selectors/backlogItemSelectors";

export interface PushBacklogItemModel extends BacklogItemModel {
    prevBacklogItemId: string | null;
    nextBacklogItemId: string | null;
}

const SCHEMA_VER_0_9_0 = "v0.9.0";

const pushBacklogItemSaved = (item: BacklogItemModel, prevBacklogItemId: string | null, nextBacklogItemId: string | null) => {
    const payload: WebsocketPushNotification<PushBacklogItemModel> = {
        type: PushNotificationType.ModifiedBacklogItems,
        data: {
            item: { ...item, prevBacklogItemId, nextBacklogItemId },
            operation: PushOperationType.Added
        },
        schema: SCHEMA_VER_0_9_0
    };
    wsClient.send(payload);
};

const pushBacklogItemDeleted = (item: BacklogItemModel) => {
    const payload: WebsocketPushNotification<BacklogItemModel> = {
        type: PushNotificationType.ModifiedBacklogItems,
        data: {
            item,
            operation: PushOperationType.Removed
        },
        schema: SCHEMA_VER_0_9_0
    };
    wsClient.send(payload);
};

const pushBacklogItemUpdated = (item: BacklogItemModel) => {
    const payload: WebsocketPushNotification<BacklogItemModel> = {
        type: PushNotificationType.ModifiedBacklogItems,
        data: {
            item,
            operation: PushOperationType.Updated
        },
        schema: SCHEMA_VER_0_9_0
    };
    wsClient.send(payload);
};

export const wsMiddleware: Middleware<{}, StateTree> = (store) => (next) => (action: Action) => {
    const dispatch = store.dispatch as Dispatch<any>;
    next(action);
    switch (action.type) {
        case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
            const state = store.getState();
            const actionTyped = action as ApiPostBacklogItemSuccessAction;
            const item = actionTyped.payload.response.data?.item;
            const meta = actionTyped.meta;
            const prevBacklogItemId = meta?.requestBody?.data?.prevBacklogItemId ?? null;
            const prevNextAndCurrent = getPrevNextAndCurrentById(state, item.id);
            const nextBacklogItemId = prevNextAndCurrent.next?.id;
            pushBacklogItemSaved(mapApiItemToBacklogItem(item), prevBacklogItemId, nextBacklogItemId);
            break;
        }
        case ActionTypes.API_DELETE_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiDeleteBacklogItemSuccessAction;
            const item = actionTyped.payload.response.data?.item;
            pushBacklogItemDeleted(mapApiItemToBacklogItem(item));
            break;
        }
        case ActionTypes.API_PUT_BACKLOG_ITEM_SUCCESS: {
            const actionTyped = action as ApiPutBacklogItemSuccessAction;
            const item = actionTyped.payload.response.data?.item;
            pushBacklogItemUpdated(mapApiItemToBacklogItem(item));
            break;
        }
        case ActionTypes.RECEIVE_WEBSOCKET_MESSAGE: {
            const actionTyped = action as ReceiveWebsocketMessageAction;
            const msgDecoded = JSON.parse(actionTyped.payload || "{}");
            if (msgDecoded.type === PushNotificationType.ModifiedBacklogItems) {
                let data: WebsocketPushNotificationData<any>;
                if (!msgDecoded.schema) {
                    // before v0.9.0 the only push notification was "added", so we treat every message with a missing schema
                    // version as an "added" push notification
                    const msgDecodedAsType = msgDecoded as WebsocketPushNotificationV0<PushBacklogItemModel>;
                    data = {
                        operation: PushOperationType.Added,
                        item: msgDecodedAsType.data
                    };
                } else {
                    const msgDecodedAsType = msgDecoded as WebsocketPushNotification<any>;
                    data = msgDecodedAsType.data;
                }
                if (data) {
                    dispatch(receivePushedBacklogItem(data));
                }
            }
            break;
        }
    }
};
