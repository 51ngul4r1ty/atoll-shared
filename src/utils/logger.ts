/**
 * Purpose: this is a client-side logging utility.
 */

// consts/enums
import * as loggingTags from "../constants/loggingTags";

export type LevelType = "info" | "warn" | "error";

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
            !hasTag(tags, loggingTags.DRAG_BACKLOGITEM) &&
            !hasTag(tags, loggingTags.APP_EVENTS)
        );
    }
    return true;
};

export const getNextLoggingNestLevel = (loggingNestLevel: number | null): number => {
    return (loggingNestLevel || 0) + 1;
};

export const formatTags = (tags: string[]): string => {
    let result = "";
    tags.forEach((tag) => {
        if (result) {
            result += ", ";
        }
        result += `"${tag}"`;
    });
    return result ? ` [${result}]` : "";
};

export const formatMessage = (msg: string, loggingNestLevel: number | null, errorStack?: string): string => {
    const nestLevel = loggingNestLevel || 0;
    let result = "";
    for (let i = 0; i < nestLevel; i++) {
        result += "  ";
    }
    result += msg;
    if (errorStack) {
        result += `; stack=${errorStack}`;
    }
    return result;
};

export interface LoggingContext {
    nestLevel: number;
}

export const LOGGING_CONTEXT_DEFAULT = { nestLevel: 1 } as LoggingContext;

export const info = (
    msg: string,
    tags: string[],
    logContext: LoggingContext = LOGGING_CONTEXT_DEFAULT,
    errorStack?: string
): LoggingContext => {
    if (shouldLogThis(tags, "info")) {
        console.log(formatMessage(msg, logContext.nestLevel, errorStack) + formatTags(tags));
    }
    return { nestLevel: getNextLoggingNestLevel(logContext.nestLevel) };
};

export const warn = (
    msg: string,
    tags: string[],
    logContext: LoggingContext = LOGGING_CONTEXT_DEFAULT,
    errorStack?: string
): LoggingContext => {
    if (shouldLogThis(tags, "warn")) {
        console.warn(formatMessage(msg, logContext.nestLevel, errorStack) + formatTags(tags));
    }
    return { nestLevel: getNextLoggingNestLevel(logContext.nestLevel) };
};

export const error = (
    msg: string,
    tags: string[],
    logContext: LoggingContext = LOGGING_CONTEXT_DEFAULT,
    errorStack?: string
): LoggingContext => {
    if (shouldLogThis(tags, "error")) {
        console.warn(formatMessage(msg, logContext.nestLevel, errorStack) + formatTags(tags));
    }
    return { nestLevel: getNextLoggingNestLevel(logContext.nestLevel) };
};
