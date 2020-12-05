// interfaces/types
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";

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
    finishDate: Date;
    id: string;
    instanceId: number | null;
    name: string;
    plannedPoints: number | null;
    remainingSplitPoints: number | null;
    saved: boolean;
    startDate: Date;
    status: SprintStatus;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}
