export const ONE_SECOND_AS_MILLISECONDS = 1000;
export const ONE_MINUTE_AS_MILLISECONDS = 60 * ONE_SECOND_AS_MILLISECONDS;
export const ONE_HOUR_AS_MILLISECONDS = 60 * ONE_MINUTE_AS_MILLISECONDS;
export const ONE_DAY_AS_MILLISECONDS = 24 * ONE_HOUR_AS_MILLISECONDS;

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date.getTime() + days * ONE_DAY_AS_MILLISECONDS);
    return result;
};

export const addHours = (date: Date, hours: number): Date => {
    const result = new Date(date.getTime() + hours * ONE_HOUR_AS_MILLISECONDS);
    return result;
};

export const addMinutes = (date: Date, mins: number): Date => {
    const result = new Date(date.getTime() + mins * ONE_MINUTE_AS_MILLISECONDS);
    return result;
};

export const addSeconds = (date: Date, seconds: number): Date => {
    const result = new Date(date.getTime() + seconds * ONE_SECOND_AS_MILLISECONDS);
    return result;
};

export const roundDateToDayBoundary = (dateTime: Date): Date => {
    const time = dateTime.getTime();
    const newTime = time + ONE_HOUR_AS_MILLISECONDS; // add 1 hour to make sure we go beyond any daylight savings adjust value
    const dateWithOffset = new Date(newTime);
    const newYear = dateWithOffset.getFullYear();
    const newMonth = dateWithOffset.getMonth();
    const newDay = dateWithOffset.getDate();
    return new Date(newYear, newMonth, newDay);
};

/**
 * Returns the current time and day as a Date object.  Use "dateNow" if you wish to exclude the time component.
 */
export const timeNow = (): Date => {
    return new Date();
};

export const sameDateAndTime = (date1: Date, date2: Date) => {
    return date1.getTime() === date2.getTime();
};

export const sameDay = (date1: Date | null | undefined, date2: Date | null | undefined) => {
    if (!date1) {
        return !date2;
    } else if (!date2) {
        return false;
    }
    const roundedDate1 = roundDateToDayBoundary(date1);
    const roundedDate2 = roundDateToDayBoundary(date2);
    return sameDateAndTime(roundedDate1, roundedDate2);
};

export const daySequenceIs = (date1: Date | null | undefined, date2: Date | null | undefined): boolean | null => {
    if (!date1 || !date2) {
        return null;
    }
    if (sameDay(date1, date2)) {
        return null;
    }
    const roundedDate1 = roundDateToDayBoundary(date1);
    const roundedDate2 = roundDateToDayBoundary(date2);
    return roundedDate2.getTime() > roundedDate1.getTime();
};

export const timeSequenceIs = (date1: Date, date2: Date): boolean => {
    if (!date1 && date2) {
        throw new Error("Unable to determine time sequence when first date provided is null/undefined");
    }
    if (date1 && !date2) {
        throw new Error("Unable to determine time sequence when second date provided is null/undefined");
    }
    return date2.getTime() > date1.getTime();
};

export const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const monthToAbbrString = (month: number | null | undefined, startingIndex: number = 0) => {
    if (!month && month !== 0) {
        return "";
    }
    return abbreviateMonth(MONTH_NAMES[month - startingIndex]);
};

export const monthToString = (month: number | null | undefined, startingIndex: number = 0) => {
    if (!month && month !== 0) {
        return "";
    }
    return MONTH_NAMES[month - startingIndex];
};

export const abbreviateMonth = (val: string) => {
    if (!val) {
        return val;
    }
    return val.substr(0, Math.min(val.length, 3));
};

export const isValidDate = (text: string): boolean => {
    return stringToDate(text) !== null;
};

export const stringToDate = (text: string): Date | null => {
    const result = new Date(Date.parse(text));
    if (isNaN(result.getTime())) {
        return null;
    }
    return result;
};

/**
 * Determines whether a timeout has expired since the date provided.  If the date provided is
 * falsy it will always return true because an undefined date is treated as the earliest possible
 * date value (negative infinity for all intents and purposes).
 * @param date Date instance or undefined value
 * @param timeoutInSeconds for example, 120 means 2 minutes
 * @returns true if the timeout has expired
 */
export const timeoutExpired = (date: Date | undefined, timeoutInSeconds: number): boolean => {
    if (!date) {
        return true;
    }
    const now = timeNow();
    const expiryDate = addSeconds(date, timeoutInSeconds);
    return timeSequenceIs(expiryDate, now);
};

/**
 * Returns the current day as a Date object without any time component.  "timeNow" can be used if you wish to include the time as
 * well.
 */
export const dateNow = (): Date => {
    const n = timeNow();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

export const dateNowUtc = (): Date => {
    const n = timeNow();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
};
