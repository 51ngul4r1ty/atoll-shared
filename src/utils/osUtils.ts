import * as os from "os";

export const platformNames = {
    WINDOWS: "WINDOWS",
    MAC: "MAC",
    LINUX: "LINUX",
    SUN: "SUN",
    OPENBSD: "OPENBSD",
    ANDROID: "ANDROID",
    AIX: "AIX"
};

export const platformValues = {
    WINDOWS: "win32",
    MAC: "darwin",
    LINUX: "linux",
    SUN: "sunos",
    OPENBSD: "openbsd",
    ANDROID: "android",
    AIX: "aix"
};

const platformToNameMap = {
    win32: platformNames.WINDOWS,
    darwin: platformNames.MAC,
    linux: platformNames.LINUX,
    sunos: platformNames.SUN,
    openbsd: platformNames.OPENBSD,
    android: platformNames.ANDROID,
    aix: platformNames.AIX
};

export const currentPlatformValue = os.platform();

export const platformName = platformToNameMap[os.platform()];

export const isPlatformWindows = () => os.platform() === platformValues.WINDOWS;

export const isPlatformMacOSX = () => os.platform() === platformValues.MAC;
