// interfaces/types
import type { BaseModelItem } from "../types/dataModelTypes";

// consts/enums
import { BacklogItemStatus } from "./backlogItemEnums";

export type BacklogItemPart = BaseModelItem & {
    externalId: string | null;
    backlogItemId: string | null;
    partIndex: number;
    percentage: number;
    points: number | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    status: BacklogItemStatus | null;
};
