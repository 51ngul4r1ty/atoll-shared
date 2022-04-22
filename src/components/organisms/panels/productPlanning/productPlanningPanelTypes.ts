// externals
import { WithTranslation } from "react-i18next";

// interfaces/types
import type { BacklogItemWithSource } from "../../../../reducers/backlogItems/backlogItemsReducerTypes";
import type { StoryPhrases } from "../../../../types/storyTypes";

// consts/enums
import { BacklogItemType } from "../../../../types/backlogItemTypes";
import { EditMode } from "../../../common/componentEnums";

export interface PlanningPanelBacklogItem extends StoryPhrases {
    estimate: number | null;
    friendlyId: string;
    externalId: string;
    id: string;
    instanceId: number | null;
    type: BacklogItemType;
    saved: boolean;
}

export interface BacklogItemPlanningPanelStateProps {
    allItems: BacklogItemWithSource[];
    busyJoiningUnallocatedParts: boolean;
    busySplittingStory: boolean;
    className?: string;
    editMode: EditMode;
    openedDetailMenuBacklogItemId: string | null;
    renderMobile?: boolean;
    strictMode: boolean;
}

export interface OnAddedNewBacklogItemForm {
    (itemType: BacklogItemType): void;
}

export interface OnReorderBacklogItems {
    (sourceItemId: string, targerItemId: string);
}

export interface BacklogItemPlanningPanelDispatchProps {
    onAddNewBacklogItemForm: OnAddedNewBacklogItemForm;
    onReorderBacklogItems: OnReorderBacklogItems;
}

export type ProductPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

export interface CardPosition {
    id: string;
    documentTop: number;
    documentBottom: number;
}
