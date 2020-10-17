// externals
import { ForwardRefExoticComponent, PropsWithoutRef, PropsWithChildren, RefAttributes } from "react";
import { Action } from "redux";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

// state
import { BacklogItemsState } from "./reducers/backlogItems/backlogItemsReducerTypes";
import { ApiLinkState } from "./reducers/apiLinksReducer";
import { BacklogItemRanksState } from "./reducers/backlogItemRanksReducer";
import { UserSettings } from "./apiModelTypes";
import { SprintsState } from "./reducers/sprintsReducer";

export type Locale = "en_US" | "de_DE";

// TODO: Move this to rootReducer
export interface StateTree {
    apiLinks: ApiLinkState;
    app: AppState;
    backlogItems: BacklogItemsState;
    backlogItemRanks: BacklogItemRanksState;
    user: UserState;
    featureToggles: FeatureTogglesState;
    sprints: SprintsState;
}

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

export type UserState = Readonly<{
    preferences: UserSettings;
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

/* Story Related */

export interface StoryPhrases {
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;
}

export type ISODateString = string;
