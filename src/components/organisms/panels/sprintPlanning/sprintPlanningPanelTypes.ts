export enum SprintStatus {
    None = 0,
    NotStarted = 1,
    InProgress = 2,
    Completed = 3
}

export interface SprintPlanningPanelSprint {
    id: string;
    expanded: boolean;
    name: string;
    startDate: Date;
    finishDate: Date;
    status: SprintStatus;
    plannedPoints: number | null;
    acceptedPoints: number | null;
    velocityPoints: number | null;
    usedSplitPoints: number | null;
    remainingSplitPoints: number | null;
}
