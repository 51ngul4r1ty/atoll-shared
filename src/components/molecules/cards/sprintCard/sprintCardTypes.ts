// interfaces/types
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";
import { DateOnly } from "../../../../types/dateTypes";

export enum SprintStatus {
    None = 0,
    NotStarted = 1,
    InProgress = 2,
    Completed = 3
}

export interface SprintCardSprint {
    acceptedPoints: number | null;
    archived: boolean;
    backlogItems: SprintBacklogItem[] | null;
    backlogItemsLoaded: boolean;
    editing: boolean;
    expanded: boolean;
    finishDate: DateOnly | null;
    id: string;
    instanceId: number | null;
    name: string;
    plannedPoints: number | null;
    remainingSplitPoints: number | null;
    saved: boolean;
    startDate: DateOnly | null;
    status: SprintStatus;
    totalPoints: number | null;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}
