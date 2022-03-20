import { ISODateString } from "../types";

export const isoDateStringToDate = (isoDate: ISODateString): Date | null | undefined => {
    if (isoDate === undefined) {
        return undefined;
    }
    if (!isoDate) {
        return null;
    }
    return new Date(isoDate);
};

export const dateToIsoDateString = (date: Date): string | null | undefined => {
    if (date === undefined) {
        return undefined;
    }
    if (!date) {
        return null;
    }
    return date.toISOString();
};
