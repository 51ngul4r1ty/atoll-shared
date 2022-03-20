// consts/enums
import { BacklogItemStatus } from "../types/backlogItemEnums";

export const hasBacklogItemAtLeastBeenReleased = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Released;

export const hasBacklogItemAtLeastBeenAccepted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Accepted || hasBacklogItemAtLeastBeenReleased(backlogItemStatus);

export const hasBacklogItemAtLeastBeenFinished = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Done || hasBacklogItemAtLeastBeenAccepted(backlogItemStatus);

export const hasBacklogItemAtLeastBeenStarted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.InProgress || hasBacklogItemAtLeastBeenFinished(backlogItemStatus);

export const hasBacklogItemAtMostBeenNotStarted = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.None || backlogItemStatus === BacklogItemStatus.NotStarted;

export const hasBacklogItemAtMostBeenInProgress = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.InProgress || hasBacklogItemAtMostBeenNotStarted(backlogItemStatus);

export const hasBacklogItemAtMostBeenDone = (backlogItemStatus: BacklogItemStatus) =>
    backlogItemStatus === BacklogItemStatus.Done || hasBacklogItemAtMostBeenInProgress(backlogItemStatus);
