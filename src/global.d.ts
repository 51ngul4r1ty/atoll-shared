declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        PUBLIC_URL: string;
    }
}

declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module "*.module.css" {
    const css: { [key: string]: string };
    export default css;
}

declare module "*.css" {
    const src: string;
    export default src;
}

declare module "*.json" {
    const src: string;
    export default src;
}

declare const __BROWSER__: string;
declare const __SERVER__: string;

interface Window {
    browserHistory: any;
    store: any;
    __PRELOADED_STATE__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any; //typeof compose; - TODO: Find out whyt this didn't work
}

declare module "express-manifest-helpers";

// NOTE: Used our own defn and reverted back to 12.x to get it working with TypeScript
declare module "i18next" {
    let languages;
    const init: { (obj: any): void };
    const changeLanguage: { (locale: any): void };
}
