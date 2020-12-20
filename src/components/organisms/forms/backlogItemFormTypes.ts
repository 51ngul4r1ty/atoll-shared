// interfaces/types
import { StoryPhrases } from "../../../types";
import { BacklogItemType } from "../../../types/backlogItemTypes";

/**
 * BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemEditableFields extends StoryPhrases {
    estimate: number | null;
    id: string;
    friendlyId: string;
    externalId: string;
    type: BacklogItemType;
}

/**
 * BacklogItemInstanceEditableFields can be used for backlog items that have not yet been persisted.
 * On the other hand, BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemInstanceEditableFields extends BacklogItemEditableFields {
    instanceId: number;
}
