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
export interface ApiBacklogItem extends StandardItem, StoryPhrases {
    acceptanceCriteria: string | null;
    acceptedAt: ISODateString | null;
    estimate: number | null;
    externalId: string | null;
    finishedAt: ISODateString | null;
    friendlyId: string | null;
    projectId: string | null;
    releasedAt: ISODateString | null;
    startedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;
    type: BacklogItemType;
}

export interface ApiBacklogItemInSprint extends ApiBacklogItem {
    displayindex: number | null;
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

export interface ApiSprintBacklogItem extends BaseItem {
    sprintId: string;
    backlogitemId: string;
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
