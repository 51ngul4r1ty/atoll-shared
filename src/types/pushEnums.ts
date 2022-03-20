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
