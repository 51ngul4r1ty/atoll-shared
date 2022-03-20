// utils
import { mapApiStatusToBacklogItem } from "../mappers/statusMappers";

export const getValidStatuses = (): string[] => {
    return ["null", '"N"', '"P"', '"D"'];
};

export const isValidStatus = (status: string) => {
    try {
        mapApiStatusToBacklogItem(status);
        return true;
    } catch (err) {
        return false;
    }
};
