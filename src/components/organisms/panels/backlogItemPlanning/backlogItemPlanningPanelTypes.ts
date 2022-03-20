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
    className?: string;
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
    busySplittingStory: boolean;
    renderMobile?: boolean;
    openedDetailMenuBacklogItemId: string | null;
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

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

export interface CardPosition {
    id: string;
    documentTop: number;
    documentBottom: number;
}
