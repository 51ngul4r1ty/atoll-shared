// TODO: Move these types into files under the ./types folder

// consts/enums
import { PushNotificationType, PushOperationType } from "./enums";

/* Data model related */

export interface BaseModelItem {
    id: string;
}

export interface StandardModelItem extends BaseModelItem {
    version?: number;
    createdAt: Date;
    updatedAt: Date;
}

/* App state related */

export interface BasePushNotification {
    type: PushNotificationType;
}
export interface WebsocketPushNotificationData<T = any> {
    item: T;
    operation: PushOperationType;
}
export interface WebsocketPushNotification<T> extends BasePushNotification {
    data: WebsocketPushNotificationData<T>;
    schema: string;
}

export interface WebsocketPushNotificationV0<T> extends BasePushNotification {
    data: T;
}

/* Story Related */

export interface StoryPhrases {
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;
}

export type ISODateString = string;
