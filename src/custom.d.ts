interface ConnectedReactRouterPush {
    (route: string): any;
}

declare module "connected-react-router" {
    export const push: ConnectedReactRouterPush;
}
