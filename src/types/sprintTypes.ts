// interfaces/types
import { BaseModelItem } from "../types";

export interface SprintModel extends BaseModelItem {
    acceptedPoints: number | null;
    archived: boolean;
    createdAt: Date;
    finishdate: string | null;
    name: string;
    plannedPoints: number | null;
    projectId: string;
    remainingSplitPoints: number | null;
    startdate: string | null;
    totalPoints: number | null;
    updatedAt: Date;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}

// TODO: Maybe move this to "SaveableSprint", is it really needed
//       for the "base" SprintItem?
export interface SprintItem extends SprintModel {
    instanceId?: number | null;
}
