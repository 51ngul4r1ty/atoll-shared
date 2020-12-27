// consts/enums
import { BacklogItemStatus } from "../types/backlogItemTypes";

export const hasBacklogItemAtLeastBeenReleased = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Released;

export const hasBacklogItemAtLeastBeenAccepted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Accepted || hasBacklogItemAtLeastBeenReleased(backlogItemStatus);

export const hasBacklogItemAtLeastBeenFinished = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Done || hasBacklogItemAtLeastBeenAccepted(backlogItemStatus);

export const hasBacklogItemAtLeastBeenStarted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.InProgress || hasBacklogItemAtLeastBeenFinished(backlogItemStatus);
