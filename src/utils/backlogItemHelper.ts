// interfaces/types
import { ApiBacklogItem } from "../apiModelTypes";

export const buildBacklogDisplayId = (externalId: string | null, friendlyId: string) => {
    return externalId || friendlyId;
};
