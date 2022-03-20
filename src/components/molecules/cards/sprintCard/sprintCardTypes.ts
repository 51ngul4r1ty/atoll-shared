// interfaces/types
import { BacklogItemInSprint } from "../../../../types/backlogItemTypes";
import { DateOnly } from "../../../../types/dateTypes";
import { ItemMenuBuilder } from "../../menus/menuBuilderTypes";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

export enum SprintStatus {
    None = 0,
    NotStarted = 1,
    InProgress = 2,
    Completed = 3
}

export interface SprintCardSprint {
    acceptedPoints: number | null;
    archived: boolean;
    backlogItems: BacklogItemInSprint[] | null;
    backlogItemsLoaded: boolean;
    editing: boolean;
    expanded: boolean;
    finishDate: DateOnly | null;
    id: string;
    instanceId: number | null;
    name: string;
    plannedPoints: number | null;
    remainingSplitPoints: number | null;
    saved: boolean;
    startDate: DateOnly | null;
    status: SprintStatus;
    totalPoints: number | null;
    usedSplitPoints: number | null;
    velocityPoints: number | null;
}

export interface SprintCardStateProps extends SprintCardSprint {
    archived: boolean;
    buildItemMenu?: ItemMenuBuilder;
    busySplittingStory?: boolean;
    className?: string;
    disableAddBacklogItemButton: boolean;
    editMode: EditMode;
    openedDetailMenuBacklogItemId: string;
    openingDetailMenuBacklogItemId: string;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
    showDetailMenu?: boolean;
    showDetailMenuToLeft?: boolean;
    splitToNextSprintAvailable: boolean;
}

export interface SprintCardDispatchProps {
    onAddBacklogItem: { (): void };
    onBacklogItemAcceptedClick: { (id: string): void };
    onBacklogItemDetailClick: { (id: string): void };
    onBacklogItemDoneClick: { (id: string): void };
    onBacklogItemIdClick: { (id: string): void };
    onBacklogItemInProgressClick: { (id: string): void };
    onBacklogItemNotStartedClick: { (id: string): void };
    onBacklogItemReleasedClick: { (id: string): void };
    onExpandCollapse: { (id: string, expand: boolean): void };
    onMoveItemToBacklogClick: { (id: string): void };
    onSplitBacklogItemClick: { (id: string): void };
    onSprintDetailClick: { (): void };
}

export type SprintCardProps = SprintCardStateProps & SprintCardDispatchProps;
