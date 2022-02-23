// consts/enums
import { PushNotificationType } from "../types/pushEnums";

// externals
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";

// actions
import { getApiHostName, getApiPort, requiresSecureProtocol } from "../config";

// interfaces/types
import type { BasePushNotification } from "../types/pushTypes";

// utils
import * as logger from "./logger";

// consts/enums
import * as loggingTags from "../constants/loggingTags";

let client: W3CWebSocket;

let keepaliveTimeout: NodeJS.Timeout = null;

const setKeepaliveTimeout = () => {
    keepaliveTimeout = setTimeout(() => {
        logger.info("re-scheduling next keepalive", [loggingTags.KEEPALIVE]);
        setKeepaliveTimeout();
        const keepalivePayload: BasePushNotification = {
            type: PushNotificationType.KeepAlive
        };
        logger.info("send keepalive", [loggingTags.KEEPALIVE]);
        try {
            send(keepalivePayload);
        } catch (err) {
            logger.warn(`Unable to send keepalive timeout: ${err}`, [loggingTags.KEEPALIVE]);
        }
    }, 30000);
};

export const init = (callback: { (data: any) }) => {
    const apiHostName = getApiHostName();
    const apiPort = getApiPort();
    const scheme = requiresSecureProtocol() ? "wss" : "ws";
    client = new W3CWebSocket(`${scheme}://${apiHostName}:${apiPort}/ws`);
    client.onopen = () => {
        logger.info("WebSocket Client Connected", [loggingTags.WEBSOCKET]);
        if (keepaliveTimeout) {
            clearTimeout(keepaliveTimeout);
        }
        setKeepaliveTimeout();
    };
    client.onclose = () => {
        logger.info("WebSocket Client Disconnected", [loggingTags.WEBSOCKET]);
    };
    client.onmessage = (message: IMessageEvent) => {
        callback(message.data);
        logger.info(`Dispatched websocket message ${message}`, [loggingTags.WEBSOCKET]);
    };
};

export const send = (payload: any) => {
    if (client) {
        client.send(JSON.stringify(payload));
    }
};

export const getClient = () => client;
