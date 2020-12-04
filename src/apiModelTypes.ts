// interfaces/types
import { ISODateString, StoryPhrases } from "./types";

export type uuid = string;

export type BacklogItemType = "story" | "issue";

export interface BaseItem {
    createdAt: Date; // sequelize standard field
    updatedAt: Date; // sequelize standard field
    version: number; // sequelize standard field
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

export interface ApiBacklogItem extends StandardItem, StoryPhrases {
    friendlyId: string | null;
    externalId: string | null;
    estimate: number | null;
    type: BacklogItemType;
    projectId: string | null;
    status: string | null;
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

export interface ApiSprint extends StandardNamedItem {
    acceptedPoints: number | null;
    finishdate: ISODateString;
    plannedPoints: number | null;
    projectId: string;
    remainingSplitPoints: number | null;
    startdate: ISODateString;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
    archived: boolean;
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
