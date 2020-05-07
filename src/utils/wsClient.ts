// externals
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";

// actions
import { getApiHostName, getApiPort, requiresSecureProtocol } from "../config";

// interfaces/types
import { PushNotification, PushNotificationType, BasePushNotification } from "../types";

let client: W3CWebSocket;

let keepaliveTimeout: NodeJS.Timeout = null;

const setKeepaliveTimeout = () => {
    keepaliveTimeout = setTimeout(() => {
        console.log("re-scheduling next keepalive");
        setKeepaliveTimeout();
        const keepalivePayload: BasePushNotification = {
            type: PushNotificationType.KeepAlive
        };
        console.log("send keepalive");
        try {
            send(keepalivePayload);
        } catch (err) {
            console.warn(`Unable to send keepalive timeout: ${err}`);
        }
    }, 30000);
};

export const init = (callback: { (data: any) }) => {
    const apiHostName = getApiHostName();
    const apiPort = getApiPort();
    const scheme = requiresSecureProtocol() ? "wss" : "ws";
    client = new W3CWebSocket(`${scheme}://${apiHostName}:${apiPort}/ws`);
    client.onopen = () => {
        console.log("WebSocket Client Connected");
        if (keepaliveTimeout) {
            clearTimeout(keepaliveTimeout);
        }
        setKeepaliveTimeout();
    };
    client.onclose = () => {
        console.log("WebSocket Client Disconnected");
    };
    client.onmessage = (message: IMessageEvent) => {
        callback(message.data);
        // dispatch(receiveWebSocketMessage(message.data));
        console.log(`Dispatched websocket message ${message}`);
    };
};

export const send = (payload: any) => {
    if (client) {
        client.send(JSON.stringify(payload));
    }
};

export const getClient = () => client;
