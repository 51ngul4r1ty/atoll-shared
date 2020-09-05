import * as os from "os";

export const platforms = {
    WINDOWS: "WINDOWS",
    MAC: "MAC",
    LINUX: "LINUX",
    SUN: "SUN",
    OPENBSD: "OPENBSD",
    ANDROID: "ANDROID",
    AIX: "AIX"
};

const platformsNames = {
    win32: platforms.WINDOWS,
    darwin: platforms.MAC,
    linux: platforms.LINUX,
    sunos: platforms.SUN,
    openbsd: platforms.OPENBSD,
    android: platforms.ANDROID,
    aix: platforms.AIX
};

export const currentPlatform = os.platform();

export const platformName = platformsNames[os.platform()];

export const isPlatformWindows = () => os.platform() === platforms.WINDOWS;

export const isPlatformMacOSX = () => os.platform() === platforms.MAC;
