import { platforms } from "./osUtils";

export const buildClassName = (...classNames: string[]) => {
    const itemsToUse = [];
    classNames.forEach((className) => {
        if (className) {
            itemsToUse.push(className);
        }
    });
    return itemsToUse.join(" ");
};

export const buildOsClassName = (platform: string) => {
    switch (platform) {
        case platforms.WINDOWS:
            return "os-windows";
        case platforms.MAC:
            return "os-mac";
        case platforms.LINUX:
            return "os-linux";
        case platforms.SUN:
            return "os-sun";
        case platforms.OPENBSD:
            return "os-openbsd";
        case platforms.ANDROID:
            return "os-android";
        case platforms.AIX:
            return "os-aix";
        default:
            return "os-unknown";
    }
};
