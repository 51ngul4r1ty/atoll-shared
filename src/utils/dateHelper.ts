export const ONE_HOUR_AS_MILLISECONDS = 60 * 60 * 1000;

export const addHours = (date: Date, hours: number): Date => {
    const result = new Date(date.getTime() + hours * ONE_HOUR_AS_MILLISECONDS);
    return result;
};
