import { ISODateString } from "../types";

export const isoDateStringToDate = (isoDate: ISODateString): Date => {
    return new Date(isoDate);
};
