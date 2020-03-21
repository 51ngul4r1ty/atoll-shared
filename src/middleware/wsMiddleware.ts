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

// selectors
import { getPrevNextAndCurrentById } from "../selectors/backlogItemSelectors";

interface PushBacklogItemModel extends BacklogItemModel {
    prevBacklogItemId: string | null;
    nextBacklogItemId: string | null;
}

const pushBacklogItemSaved = (item: BacklogItemModel, prevBacklogItemId: string | null, nextBacklogItemId: string | null) => {
    const payload: PushNotification<PushBacklogItemModel> = {
        type: PushNotificationType.ModifiedBacklogItems,
        data: { ...item, prevBacklogItemId, nextBacklogItemId }
    };
    wsClient.send(payload);
};

export const wsMiddleware = (store) => (next) => (action: Action) => {
    const dispatch = store.dispatch as Dispatch<any>;
    next(action);
    switch (action.type) {
        case ActionTypes.API_POST_BACKLOG_ITEM_SUCCESS: {
            const state = store.getState();
            const actionTyped = action as ApiPostBacklogItemSuccessAction;
            if (actionTyped.payload.response?.status === 201) {
                const item = actionTyped.payload.response.data?.item;
                const meta = actionTyped.meta as any;
                const prevBacklogItemId = meta?.requestBody?.data?.prevBacklogItemId || null;
                const prevNextAndCurrent = getPrevNextAndCurrentById(state, item.id);
                const nextBacklogItemId = prevNextAndCurrent.next.id;
                pushBacklogItemSaved(item, prevBacklogItemId, nextBacklogItemId);
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
