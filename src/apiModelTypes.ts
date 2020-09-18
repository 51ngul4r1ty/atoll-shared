export type uuid = string;

export type BacklogItemType = "story" | "issue";

export interface BaseItem {
    createdAt: Date; // sequelize standard field
    updatedAt: Date; // sequelize standard field
    version: number; // sequelize standard field
}

export interface ItemWithId {
    id: uuid;
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

export interface ApiBacklogItem extends StandardItem {
    friendlyId: string | null;
    externalId: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;
    estimate: number | null;
    type: BacklogItemType;
}

// TODO: Need to figure out good place for this type - it maps to the database structure, but is it really just an exact copy or
//       could it potentially deviate from it?
export interface ApiBacklogItemRank extends StandardItem {
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
    startDate: Date;
    finishDate: Date;
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
