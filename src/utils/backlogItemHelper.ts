// consts/enums
import { BacklogItemStatus } from "../types/backlogItemTypes";

export const hasBacklogItemAtLeastBeenAccepted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Accepted || backlogItemStatus === BacklogItemStatus.Released;

export const buildBacklogDisplayId = (externalId: string | null, friendlyId: string) => {
    return externalId || friendlyId;
};
