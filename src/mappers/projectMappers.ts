// interfaces/types
import { ApiProject } from "../types/apiModelTypes";
import { Project } from "../reducers/project/projectReducerTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";

export const mapApiItemToProject = (apiItem: ApiProject | null): Project | null => {
    if (!apiItem) {
        return null;
    }
    const createdAt = isoDateStringToDate(apiItem.createdAt);
    const updatedAt = isoDateStringToDate(apiItem.updatedAt);
    return {
        id: apiItem.id,
        name: apiItem.name,
        description: apiItem.description,
        createdAt,
        updatedAt
    };
};
