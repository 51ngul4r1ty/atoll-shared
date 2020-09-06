import { platformValues } from "./osUtils";

export const buildClassName = (...classNames: string[]) => {
    const itemsToUse = [];
    classNames.forEach((className) => {
        if (className) {
            itemsToUse.push(className);
        }
    });
    return itemsToUse.join(" ");
};

export const buildOsClassName = (platformValue: string) => {
    switch (platformValue) {
        case platformValues.WINDOWS:
            return "os-windows";
        case platformValues.MAC:
            return "os-mac";
        case platformValues.LINUX:
            return "os-linux";
        case platformValues.SUN:
            return "os-sun";
        case platformValues.OPENBSD:
            return "os-openbsd";
        case platformValues.ANDROID:
            return "os-android";
        case platformValues.AIX:
            return "os-aix";
        default:
            return "os-unknown";
    }
};
