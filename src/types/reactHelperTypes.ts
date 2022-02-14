// externals
import { ForwardRefExoticComponent, PropsWithoutRef, PropsWithChildren, RefAttributes } from "react";
import type { Action } from "redux";

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
