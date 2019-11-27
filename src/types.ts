import { Action } from "redux";

export type Locale = "en_US" | "de_DE";

export type AppState = Readonly<{
    locale: Locale;
}>;

export interface BacklogItem {
    creationDateTime: Date;
    displayIndex: number;
    estimate: number | null;
    id: number;
    reasonPhrase: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    type: "story" | "issue";
}

export type BacklogItemsState = Readonly<{
    items: BacklogItem[];
}>;

export interface AnyFSA extends FSAWithMeta<any, any, any> {}

export interface SimpleFSA<T> extends Action<T> {}

export interface FSA<T, P> extends SimpleFSA<T> {
    payload: P;
}

export interface FSAWithMeta<T, P, M> extends FSA<T, P> {
    meta: M;
}
