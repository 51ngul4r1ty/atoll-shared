// TODO: Move these types into files under the ./types folder

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

/**
 * The enum values should adhere to the following ranges:
 *   0     = no type specified - this should never be sent, it is used to indicate that notification type has not been set
 *   1-99  = system reserved (internal use)
 *   100+  = application specific
 */
export enum PushNotificationType {
    None = 0,
    KeepAlive = 1,
    ModifiedBacklogItems = 100
}

export enum PushOperationType {
    None = 0,
    Added = 1,
    Updated = 2,
    Removed = 3,
    Reordered = 4
}

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
