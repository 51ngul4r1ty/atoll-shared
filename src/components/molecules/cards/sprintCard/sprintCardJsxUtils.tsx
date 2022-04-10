// externals
import * as React from "react";

// components
import { BacklogItemCard, BacklogItemCardType, BacklogItemTypeEnum, buildBacklogItemKey } from "../BacklogItemCard";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

// interfaces/types
import type { BacklogItemInSprint } from "../../../../types/backlogItemTypes";
import type { ItemMenuEventHandlers } from "../../menus/menuBuilderTypes";

// utils
import { sprintBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";
import { buildBacklogDisplayId } from "../../../../utils/backlogItemHelper";

export type ItemMenuBuilderBacklogItem = BacklogItemInSprint & {
    hasPartsInNextSprint: boolean;
};

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    openingDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    showDetailMenuToLeft: boolean,
    backlogItems: ItemMenuBuilderBacklogItem[],
    busySplittingStory: boolean,
    splitToNextSprintAvailable: boolean,
    onDetailClick: { (itemId: string) },
    onBacklogItemIdClick: { (itemId: string) },
    onMoveItemToBacklogClick: { (itemId: string) },
    onSplitBacklogItemClick: { (id: string): void },
    onBacklogItemAcceptedClick: { (itemId: string) },
    onBacklogItemDoneClick: { (itemId: string) },
    onBacklogItemInProgressClick: { (itemId: string) },
    onBacklogItemNotStartedClick: { (itemId: string) },
    onBacklogItemReleasedClick: { (itemId: string) }
) => {
    const eventHandlers: ItemMenuEventHandlers = {
        handleEvent: (eventName: string, itemId: string) => {
            if (eventName === "onMoveItemToBacklogClick") {
                onMoveItemToBacklogClick(itemId);
            } else if (eventName === "onSplitBacklogItemClick") {
                onSplitBacklogItemClick(itemId);
            } else if (eventName === "onBacklogItemAcceptedClick") {
                onBacklogItemAcceptedClick(itemId);
            } else if (eventName === "onBacklogItemDoneClick") {
                onBacklogItemDoneClick(itemId);
            } else if (eventName === "onBacklogItemInProgressClick") {
                onBacklogItemInProgressClick(itemId);
            } else if (eventName === "onBacklogItemNotStartedClick") {
                onBacklogItemNotStartedClick(itemId);
            } else if (eventName === "onBacklogItemReleasedClick") {
                onBacklogItemReleasedClick(itemId);
            } else {
                throw Error(`${eventName} is not handled`);
            }
        },
        isEventSupported: () => !busySplittingStory,
        isEventHandlerWaiting: (eventName: string) => eventName === "onSplitBacklogItemClick" && busySplittingStory
    };
    if (!backlogItems) {
        return null;
    }
    const itemMenuBuilder = sprintBacklogItemMenuBuilder(eventHandlers, splitToNextSprintAvailable);
    const hasDetails = editMode === EditMode.Edit;
    return backlogItems.map((backlogItem) => {
        const isLoadingDetails = backlogItem.id === openingDetailMenuBacklogItemId;
        const showDetailMenu = backlogItem.id === openedDetailMenuBacklogItemId;
        return (
            <div key={backlogItem.id}>
                <SimpleDivider />
                <BacklogItemCard
                    key={buildBacklogItemKey(backlogItem)}
                    buildItemMenu={itemMenuBuilder}
                    estimate={backlogItem.estimate}
                    hasDetails={hasDetails}
                    isLoadingDetails={isLoadingDetails}
                    internalId={`${backlogItem.id}`}
                    isDraggable={false}
                    itemId={buildBacklogDisplayId(backlogItem.externalId, backlogItem.friendlyId)}
                    itemType={backlogItem.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                    marginBelowItem
                    partIndex={backlogItem.partIndex}
                    reasonText={backlogItem.reasonPhrase}
                    renderMobile={renderMobile}
                    roleText={backlogItem.rolePhrase}
                    showDetailMenu={showDetailMenu}
                    showDetailMenuToLeft={showDetailMenuToLeft}
                    status={backlogItem.status}
                    storyEstimate={backlogItem.storyEstimate}
                    titleText={backlogItem.storyPhrase}
                    cardType={BacklogItemCardType.SprintBacklogCard}
                    totalParts={backlogItem.totalParts}
                    onDetailClick={() => {
                        onDetailClick(backlogItem.id);
                    }}
                    onBacklogItemIdClick={(itemId) => {
                        onBacklogItemIdClick(itemId);
                    }}
                />
            </div>
        );
    });
};
