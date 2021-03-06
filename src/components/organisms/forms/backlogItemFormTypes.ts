// interfaces/types
import { StoryPhrases } from "../../../types";
import { BacklogItemType } from "../../../types/backlogItemTypes";

/**
 * BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemEditableFields extends StoryPhrases {
    acceptanceCriteria: string;
    estimate: number | null;
    externalId: string;
    friendlyId: string;
    id: string;
    type: BacklogItemType;
    startedAt: Date | null;
    finishedAt: Date | null;
    acceptedAt: Date | null;
    releasedAt: Date | null;
}

/**
 * BacklogItemInstanceEditableFields can be used for backlog items that have not yet been persisted.
 * On the other hand, BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemInstanceEditableFields extends BacklogItemEditableFields {
    instanceId: number;
}
