// interfaces/types
import type { StateTree } from "../reducers/rootReducer";
import type { BacklogItemPart } from "../types/backlogItemPartTypes";
import type { BacklogItemsState } from "../reducers/backlogItems/backlogItemsReducerTypes";

// utils
import { createSelector } from "reselect";
import { backlogItems } from "./backlogItemSelectors";
import { getBacklogItemPartById as reducerGetBacklogItemPartById } from "../reducers/backlogItems/backlogItemsReducerHelper";

export type BacklogItemPartForSplitForm = BacklogItemPart & {
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
                allocatedSprintId: partAndSprint.sprint?.id ?? null,
                allocatedSprintName: partAndSprint.sprint?.name ?? null,
                editable: partAndSprint.state?.editable || false,
                expanded: true,
                id: partAndSprint.part.id,
                externalId: partAndSprint.part.externalId,
                backlogItemId: partAndSprint.part.backlogItemId,
                partIndex: partAndSprint.part.partIndex,
                percentage: partAndSprint.part.percentage,
                points: partAndSprint.part.points,
                startedAt: partAndSprint.part.startedAt,
                status: partAndSprint.part.status,
                finishedAt: partAndSprint.part.finishedAt
            };
            return part;
        });
    }
);

export const getBacklogItemPartById = (state: StateTree, itemId: string): BacklogItemPart | null => {
    return reducerGetBacklogItemPartById(state.backlogItems, itemId);
};

export const getOpenedDetailMenuBacklogItemPartId = (state: StateTree) => state.backlogItems.openedDetailMenuBacklogItemPartId;
