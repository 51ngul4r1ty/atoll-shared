// interfaces/types
import { DateOnly } from "../types/dateTypes";

export const cloneWithoutNested = <T>(item: T): T => {
    if (!item) {
        return item;
    }
    if (typeof item !== "object") {
        return item;
    }
    const result = {} as T;
    Object.keys(item).forEach((key) => {
        const fieldValue = item[key];
        if (fieldValue === null) {
            result[key] = fieldValue;
        } else if (fieldValue instanceof DateOnly) {
            result[key] = fieldValue.clone();
        } else if (fieldValue instanceof Date) {
            result[key] = new Date(fieldValue.getTime());
        } else if (typeof fieldValue !== "object") {
            result[key] = fieldValue;
        }
    });
    return result;
};

export const cloneWithNested = <T>(item: T): T => {
    return JSON.parse(JSON.stringify(item));
};
