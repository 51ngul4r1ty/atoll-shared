// consts/enums
import { PushState, Source } from "../enums";
import { SprintDetailShowingPicker } from "../../components/organisms/forms/SprintDetailForm";

// interfaces/types
import type { StandardModelItem } from "../../types/dataModelTypes";
import { DateOnly } from "../../types/dateTypes";

export type Sprint = StandardModelItem & {
    acceptedPoints: number | null;
    archived: boolean;
    backlogItemsLoaded: boolean;
    expanded?: boolean;
    finishDate: DateOnly;
    name: string;
    plannedPoints: number | null;
    projectId: string;
    remainingSplitPoints: number | null;
    startDate: DateOnly;
    totalPoints: number | null;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
};

export type EditableSprint = Sprint & {
    editing?: boolean;
};

export type SaveableSprint = EditableSprint & {
    instanceId?: number | null;
    saved?: boolean;
};

export type SprintWithSource = SaveableSprint & {
    pushState?: PushState;
    source: Source;
};

export type OriginalSprintData = {
    [id: string]: Sprint;
};

export type SprintOpenedDatePickerInfo = {
    sprintId: string | null;
    showPicker: SprintDetailShowingPicker;
};
