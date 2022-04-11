// interfaces/types
import type { StoryPhrases } from "./storyTypes";
import type { ISODateString } from "./dateTypes";

export type uuid = string;

export type BacklogItemType = "story" | "issue";

export type BaseItem = {
    createdAt?: ISODateString; // sequelize standard field
    updatedAt?: ISODateString; // sequelize standard field
    version?: number; // sequelize standard field
};

export type ItemWithId = {
    id: uuid | null;
};

export type ItemWithName = {
    name: string;
};

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export type Link = {
    type: string;
    rel: string;
    uri: string;
};

export type ApiItemWithLinks = {
    links?: Link[];
};

export type StandardItem = BaseItem & ItemWithId & ApiItemWithLinks;

export type StandardNamedItem = StandardItem & ItemWithName;

/**
 * N: Not Started
 * P: In Progress
 * D: Done
 * A: Accepted
 * R: Released
 */
export type ApiBacklogItemStatus = "N" | "P" | "D" | "A" | "R";

export type ItemWithStatusAndDates = {
    acceptedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    releasedAt: ISODateString | null;
    startedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;
};

export type ApiBacklogItemSplitInfo = {
    totalParts: number | null;
    unallocatedParts: number | null;
    unallocatedPoints: number | null;
};

export type ApiBacklogItem = StandardItem &
    StoryPhrases &
    ApiBacklogItemSplitInfo &
    ItemWithStatusAndDates & {
        /* from BaseItem */
        id: uuid | null;

        /* from StandardItem */
        createdAt?: ISODateString; // sequelize standard field
        updatedAt?: ISODateString; // sequelize standard field
        version?: number; // sequelize standard field

        /* from StoryPhrases */
        rolePhrase: string | null;
        storyPhrase: string;
        reasonPhrase: string | null;

        /* from ApiBacklogItemSplitInfo */
        totalParts: number | null;
        unallocatedParts: number | null;
        unallocatedPoints: number | null;

        /* new fields */
        acceptanceCriteria: string | null;
        estimate: number | null;
        storyEstimate: number | null;
        externalId: string | null;
        friendlyId: string | null;
        partIndex: number | null;
        projectId: string | null;
        type: BacklogItemType;
    };

export type ApiBacklogItemWithParts = ApiBacklogItem & {
    /* from BaseItem */
    id: uuid | null;

    /* from StandardItem */
    createdAt?: ISODateString; // sequelize standard field
    updatedAt?: ISODateString; // sequelize standard field
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
};

export type ApiBacklogItemPart = StandardItem & {
    externalId: string | null;
    backlogitemId: string | null;
    partIndex: number;
    percentage: number;
    points: number | null;
    startedAt: ISODateString | null;
    finishedAt: ISODateString | null;
    status: ApiBacklogItemStatus | null;
};

export type ApiBacklogItemInSprint = ApiBacklogItem & {
    /* from BaseItem */
    id: uuid | null;

    /* from StandardItem */
    createdAt?: ISODateString; // sequelize standard field
    updatedAt?: ISODateString; // sequelize standard field
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
};

export type ApiProductBacklogItem = StandardItem & {
    projectId: string | null;
    backlogitemId: string | null;
    nextbacklogitemId: string | null;
};

export type ApiCounter = StandardItem & {
    entity: string | null;
    entityId: string | null;
    entitySubtype: string;
    lastNumber: number | null;
    lastCounterValue: string | null;
};

export type ApiSprintStats = {
    acceptedPoints: number | null;
    plannedPoints: number | null;
    totalPoints: number | null;
};

export type ApiSprint = StandardNamedItem &
    ApiSprintStats & {
        archived: boolean;
        finishdate: ISODateString;
        projectId: string;
        remainingSplitPoints: number | null;
        startdate: ISODateString;
        usedSplitPoints: number | null;
        velocityPoints: number | null;
    };

export type ApiSprintBacklogItem = StandardItem & {
    storyEstimate: number | null;
    sprintId: string;
    backlogitempartId: string;
    displayindex: number | null;
};

export type CounterSettings = {
    prefix?: string;
    suffix?: string;
    totalFixedLength?: number; // if it is a fixed length this includes prefix, suffix and generated number with leading zeros
};

export type ProjectSettings = {
    counters?: {
        story: CounterSettings;
        issue: CounterSettings;
    };
};

export type ApiProjectSettings = StandardItem & {
    projectId: string | null;
    externalId: string | null;
    settings: ProjectSettings;
};

export type UserSettings = {
    detectBrowserDarkMode: boolean;
    selectedProject: string | null;
    selectedSprint: string | null;
};

export type ApiUserSettings = StandardItem & {
    appuserId: string | null;
    settings: UserSettings;
};

export type ApiProject = StandardItem & {
    name: string;
    description: string;
};
