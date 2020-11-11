// interfaces/types
import { BaseModelItem } from "../types";

export interface SprintModel extends BaseModelItem {
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    id: string;
    name: string;
    startdate: Date;
    finishdate: Date;
    plannedPoints: number | null;
    acceptedPoints: number | null;
    velocityPoints: number | null;
    usedSplitPoints: number | null;
    remainingSplitPoints: number | null;
}

// TODO: Maybe move this to "SaveableSprint", is it really needed
//       for the "base" BacklogItem?
export interface SprintItem extends SprintModel {
    instanceId?: number | null;
}
