// interfaces/types
import { BaseModelItem } from "../types";

export interface SprintModel extends BaseModelItem {
    acceptedPoints: number | null;
    createdAt: Date;
    finishdate: Date;
    id: string;
    name: string;
    plannedPoints: number | null;
    projectId: string;
    remainingSplitPoints: number | null;
    startdate: Date;
    totalPoints: number | null;
    updatedAt: Date;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}

// TODO: Maybe move this to "SaveableSprint", is it really needed
//       for the "base" BacklogItem?
export interface SprintItem extends SprintModel {
    instanceId?: number | null;
}
