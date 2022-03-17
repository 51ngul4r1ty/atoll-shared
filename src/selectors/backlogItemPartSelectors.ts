// interfaces/types
import type { StateTree } from "../reducers/rootReducer";
import type { BacklogItemPart } from "../types/backlogItemTypes";
import type { BacklogItemsState } from "../reducers/backlogItems/backlogItemsReducerTypes";

// consts/enums
import { BacklogItemStatus } from "../types/backlogItemEnums";

// utils
import { createSelector } from "reselect";
import { isoDateStringToDate } from "../utils/apiPayloadConverters";
import { mapApiStatusToBacklogItem } from "../mappers/backlogItemMappers";
import { backlogItems } from "./backlogItemSelectors";

export type BacklogItemPartForSplitForm = BacklogItemPart & {
    /* from BacklogItemPart */
    id: string | null;
    externalId: string | null;
    backlogItemId: string | null;
    partIndex: number;
    percentage: number;
    points: number | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    status: BacklogItemStatus | null;

    /* new in this type */
    allocatedSprintId: string | null;
    allocatedSprintName: string | null;
    editable: boolean;
    expanded: boolean;
};

export const getCurrentBacklogItemParts = createSelector(
    [backlogItems],
    (backlogItems: BacklogItemsState): BacklogItemPartForSplitForm[] => {
        return backlogItems.currentItemPartsAndSprints.map((partAndSprint) => {
            const part: BacklogItemPartForSplitForm = {
                allocatedSprintId: partAndSprint.sprint?.id || null,
                allocatedSprintName: partAndSprint.sprint?.name || null,
                editable: false,
                expanded: true,
                id: partAndSprint.part.id,
                externalId: partAndSprint.part.externalId,
                backlogItemId: partAndSprint.part.backlogitemId,
                partIndex: partAndSprint.part.partIndex,
                percentage: partAndSprint.part.percentage,
                points: partAndSprint.part.points,
                startedAt: isoDateStringToDate(partAndSprint.part.startedAt),
                status: mapApiStatusToBacklogItem(partAndSprint.part.status),
                finishedAt: isoDateStringToDate(partAndSprint.part.finishedAt)
            };
            return part;
        });
    }
);

export const getOpenedDetailMenuBacklogItemPartId = (state: StateTree) => state.backlogItems.openedDetailMenuBacklogItemPartId;
