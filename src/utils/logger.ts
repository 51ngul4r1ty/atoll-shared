// consts/enums
import * as loggingTags from "../constants/loggingTags";

export type LevelType = "info" | "warn";

export const hasTag = (tags: string[], tag: string): boolean => tags.indexOf(tag) >= 0;

/**
 * Check to see if logging has been turned on for this log entry- in future this will be configurable, but for now we're just
 * hard-coding this.
 */
export const shouldLogThis = (tags: string[], level: LevelType): boolean => {
    if (level === "info") {
        return (
            !hasTag(tags, loggingTags.KEEPALIVE) &&
            !hasTag(tags, loggingTags.WEBSOCKET) &&
            !hasTag(tags, loggingTags.DRAG_BACKLOGITEM)
        );
    }
    return true;
};

export const getNextLoggingNestLevel = (loggingNestLevel: number | null): number => {
    return (loggingNestLevel || 0) + 1;
};

export const formatMessage = (msg: string, loggingNestLevel: number | null): string => {
    const nestLevel = loggingNestLevel || 0;
    let result = "";
    for (let i = 0; i < loggingNestLevel; i++) {
        result += "  ";
    }
    result += msg;
    return result;
};

export interface LoggingContainer {
    nestLevel: number;
}

export const info = (msg: string, tags: string[], loggingContainer: LoggingContainer = { nestLevel: 1 }): LoggingContainer => {
    if (shouldLogThis(tags, "info")) {
        console.log(formatMessage(msg, loggingContainer.nestLevel));
    }
    return { nestLevel: getNextLoggingNestLevel(loggingContainer.nestLevel) };
};

export const warn = (msg: string, tags: string[], loggingNestLevel: LoggingContainer = { nestLevel: 1 }): number => {
    if (shouldLogThis(tags, "warn")) {
        console.warn(formatMessage(msg, loggingNestLevel.nestLevel));
    }
    return getNextLoggingNestLevel(loggingNestLevel.nestLevel);
};
