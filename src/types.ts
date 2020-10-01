// externals
import { ForwardRefExoticComponent, PropsWithoutRef, PropsWithChildren, RefAttributes } from "react";
import { Action } from "redux";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

// state
import { BacklogItemsState } from "./reducers/backlogItemsReducer";
import { ApiLinkState } from "./reducers/apiLinksReducer";

export type Locale = "en_US" | "de_DE";

export interface StateTree {
    apiLinks: ApiLinkState;
    app: AppState;
    backlogItems: BacklogItemsState;
    user: UserState;
    featureToggles: FeatureTogglesState;
}

/* Data model related */

export interface BaseModelItem {
    id: string;
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

export type AppState = Readonly<{
    authToken: string;
    editMode: EditMode;
    electronClient: boolean;
    executingOnClient: boolean;
    locale: Locale;
    password: string;
    refreshToken: string;
    username: string;
}>;

/* User state related */

export interface UserPreferences {
    detectBrowserDarkMode: boolean;
    selectedProject: string | null;
}

export type UserState = Readonly<{
    preferences: UserPreferences;
}>;

/* Feature Toggles state related */

export interface FeatureToggle {
    enabled: boolean;
    createdDateTime: Date;
    modifiedDateTime: Date;
}

export type FeatureToggles = {
    [key: string]: FeatureToggle;
};

export type FeatureTogglesState = Readonly<{
    toggles: FeatureToggles;
}>;

/* Flux Standard Action related */

export interface AnyFSA extends FSAWithMeta<any, any, any> {}

export interface SimpleFSA<T> extends Action<T> {}

export interface FSA<T, P> extends SimpleFSA<T> {
    payload?: P;
}

export interface FSAWithMeta<T, P, M> extends FSA<T, P> {
    meta?: M;
}

/* Forwarded Ref Related */

export type ComponentWithForwardedRef<P> = ForwardRefExoticComponent<PropsWithoutRef<PropsWithChildren<P>> & RefAttributes<any>>;
