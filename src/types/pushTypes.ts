// consts/enums
import { PushNotificationType, PushOperationType } from "./pushEnums";

export type BasePushNotification = {
    type: PushNotificationType;
};

export type WebsocketPushNotificationData<T = any> = {
    item: T;
    operation: PushOperationType;
};

export type WebsocketPushNotification<T> = BasePushNotification & {
    data: WebsocketPushNotificationData<T>;
    schema: string;
};

export type WebsocketPushNotificationV0<T> = BasePushNotification & {
    data: T;
};
