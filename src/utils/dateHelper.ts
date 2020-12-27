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
