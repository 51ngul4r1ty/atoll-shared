// interfaces/types
import type { StoryPhrases } from "../../../types/storyTypes";
import type { BacklogItemType } from "../../../types/backlogItemTypes";

/**
 * BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemEditableFields extends StoryPhrases {
    /* from StoryPhrases */
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;

    /* new in this interface */
    acceptanceCriteria: string;
    acceptedAt: Date | null;
    estimate: number | null;
    externalId: string;
    finishedAt: Date | null;
    friendlyId: string;
    id: string;
    releasedAt: Date | null;
    startedAt: Date | null;
    type: BacklogItemType;
}

/**
 * BacklogItemInstanceEditableFields can be used for backlog items that have not yet been persisted.
 * On the other hand, BacklogItemEditableFields can only be used for backlog items that have been persisted.
 */
export interface BacklogItemInstanceEditableFields extends BacklogItemEditableFields {
    instanceId: number;
}
