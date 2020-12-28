import { ISODateString } from "../types";

export const isoDateStringToDate = (isoDate: ISODateString): Date | null => {
    if (!isoDate) {
        return null;
    }
    return new Date(isoDate);
};

export const dateToIsoDateString = (date: Date): string | null => {
    if (!date) {
        return null;
    }
    return date.toISOString();
};
