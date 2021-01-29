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

export const now = (): Date => {
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

export const monthToAbbrString = (month: number | null | undefined) => {
    if (!month && month !== 0) {
        return "";
    }
    return abbreviateMonth(MONTH_NAMES[month]);
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
