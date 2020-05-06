// externals
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Dispatch } from "react";

// actions
import { getApiHostName, getApiPort } from "../config";

let client: W3CWebSocket;

export const init = (callback: { (data: any) }) => {
    const apiHostName = getApiHostName();
    const apiPort = getApiPort();
    client = new W3CWebSocket(`ws://${apiHostName}:${apiPort}/ws`);
    client.onopen = () => {
        console.log("WebSocket Client Connected");
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
