// interfaces/types
import { ISODateString, StoryPhrases } from "./types";

export type uuid = string;

export type BacklogItemType = "story" | "issue";

export interface BaseItem {
    createdAt?: string; // sequelize standard field
    updatedAt?: string; // sequelize standard field
    version?: number; // sequelize standard field
}

export interface ItemWithId {
    id: uuid | null;
}

export interface ItemWithName {
    name: string;
}

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface Link {
    type: string;
    rel: string;
    uri: string;
}

export interface ApiItemWithLinks {
    links?: Link[];
}

export interface StandardItem extends BaseItem, ItemWithId, ApiItemWithLinks {}

export interface StandardNamedItem extends StandardItem, ItemWithName {}

/**
 * N: Not Started
 * P: In Progress
 * D: Done
 * A: Accepted
 * R: Released
 */
export type ApiBacklogItemStatus = "N" | "P" | "D" | "A" | "R";

export interface ItemWithStatusAndDates {
    acceptedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    releasedAt: ISODateString | null;
    startedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;
}

export interface ApiBacklogItem extends StandardItem, StoryPhrases, ItemWithStatusAndDates {
    /* from BaseItem */
    id: uuid | null;

    /* from StandardItem */
    createdAt?: string; // sequelize standard field
    updatedAt?: string; // sequelize standard field
    version?: number; // sequelize standard field

    /* from StoryPhrases */
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;

    /* new fields */
    acceptanceCriteria: string | null;
    estimate: number | null;
    externalId: string | null;
    friendlyId: string | null;
    partIndex: number | null;
    projectId: string | null;
    totalParts: number | null;
    type: BacklogItemType;
    unallocatedParts: number | null;
}

export interface ApiBacklogItemWithParts extends ApiBacklogItem {
    /* from BaseItem */
    id: uuid | null;

    /* from StandardItem */
    createdAt?: string; // sequelize standard field
    updatedAt?: string; // sequelize standard field
    version?: number; // sequelize standard field

    /* from StoryPhrases */
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;

    /* from ItemWithStatusAndDates */
    acceptedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    releasedAt: ISODateString | null;
    startedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;

    /* from ApiBacklogItem */
    acceptanceCriteria: string | null;
    estimate: number | null;
    externalId: string | null;
    friendlyId: string | null;
    partIndex: number | null;
    projectId: string | null;
    totalParts: number | null;
    type: BacklogItemType;
    unallocatedParts: number | null;

    /* new fields */
    backlogItemParts: ApiBacklogItemPart[];
}

export interface ApiBacklogItemPart extends StandardItem {
    // TODO: move the status and dates related out of this interface (see ApiBacklogItem)
    externalId: string | null;
    backlogitemId: string | null;
    partIndex: number;
    percentage: number;
    points: number | null;
    startedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;
}

export interface ApiBacklogItemInSprint extends ApiBacklogItem {
    /* from BaseItem */
    id: uuid | null;

    /* from StandardItem */
    createdAt?: string; // sequelize standard field
    updatedAt?: string; // sequelize standard field
    version?: number; // sequelize standard field

    /* from StoryPhrases */
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;

    /* from ItemWithStatusAndDates */
    acceptedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    releasedAt: ISODateString | null;
    startedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;

    /* from ApiBacklogItem */
    acceptanceCriteria: string | null;
    estimate: number | null; // part.points in database (don't confuse with story estimate!)
    externalId: string | null;
    friendlyId: string | null;
    partIndex: number | null;
    projectId: string | null;
    totalParts: number | null;
    type: BacklogItemType;
    unallocatedParts: number | null;

    /* new fields */
    backlogItemPartId: string;
    displayindex: number | null;
    partPercentage: number | null;
    storyEstimate: number | null; // here's where the actual story estimate is
    storyStatus: ApiBacklogItemStatus | null;
    storyStartedAt: ISODateString | null;
    storyFinishedAt: ISODateString | null;
    storyUpdatedAt: ISODateString | null;
    storyVersion: number;
}

export interface ApiBacklogItemRank extends StandardItem {
    projectId: string | null;
    backlogitemId: string | null;
    nextbacklogitemId: string | null;
}

export interface ApiCounter extends StandardItem {
    entity: string | null;
    entityId: string | null;
    entitySubtype: string;
    lastNumber: number | null;
    lastCounterValue: string | null;
}

export interface ApiSprintStats {
    acceptedPoints: number | null;
    plannedPoints: number | null;
    totalPoints: number | null;
}

export interface ApiSprint extends StandardNamedItem, ApiSprintStats {
    archived: boolean;
    finishdate: ISODateString;
    projectId: string;
    remainingSplitPoints: number | null;
    startdate: ISODateString;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}

export interface ApiSprintBacklogItem extends BaseItem, ItemWithId {
    storyEstimate: number | null;
    sprintId: string;
    backlogitempartId: string;
    displayindex: number | null;
}

export interface CounterSettings {
    prefix?: string;
    suffix?: string;
    totalFixedLength?: number; // if it is a fixed length this includes prefix, suffix and generated number with leading zeros
}

export interface ProjectSettings {
    counters?: {
        story: CounterSettings;
        issue: CounterSettings;
    };
}

export interface ApiProjectSettings extends StandardItem {
    projectId: string | null;
    externalId: string | null;
    settings: ProjectSettings;
}

export interface UserSettings {
    detectBrowserDarkMode: boolean;
    selectedProject: string | null;
    selectedSprint: string | null;
}

export interface ApiUserSettings extends StandardItem {
    appuserId: string | null;
    settings: UserSettings;
}

export interface ApiProject extends StandardItem {
    name: string;
    description: string;
}
