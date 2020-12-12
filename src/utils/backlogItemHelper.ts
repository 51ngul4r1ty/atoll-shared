import { BacklogItem, BacklogItemStatus } from "../types/backlogItemTypes";

export const hasBacklogItemAtLeastBeenAccepted = (backlogItem: BacklogItem) =>
    backlogItem.status === BacklogItemStatus.Accepted || backlogItem.status === BacklogItemStatus.Released;
