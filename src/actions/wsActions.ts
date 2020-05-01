// consts/enums
import { RECEIVE_WEBSOCKET_MESSAGE } from "./actionTypes";

export interface ReceiveWebsocketMessageAction {
    type: typeof RECEIVE_WEBSOCKET_MESSAGE;
    payload: any;
}

export const receiveWebSocketMessage = (msg: any): ReceiveWebsocketMessageAction => ({
    type: RECEIVE_WEBSOCKET_MESSAGE,
    payload: msg
});
