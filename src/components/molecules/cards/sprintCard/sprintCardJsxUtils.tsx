// externals
import * as React from "react";

// components
import {
    BacklogItemCard,
    BacklogItemCardType,
    BacklogItemTypeEnum,
    buildBacklogItemKey,
    ItemMenuEventHandlers
} from "../BacklogItemCard";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

// utils
import { sprintBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";
import { buildBacklogDisplayId } from "../../../../utils/backlogItemHelper";

// interfaces/types
import { BacklogItemInSprint } from "../../../../types/backlogItemTypes";

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    showDetailMenuToLeft: boolean,
    backlogItems: BacklogItemInSprint[],
    busySplittingStory: boolean,
    onDetailClick: { (backlogItemId: string) },
    onBacklogItemIdClick: { (backlogItemId: string) },
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
        }
    };
    if (!backlogItems) {
        return null;
    }
    return backlogItems.map((backlogItem) => (
        <div key={backlogItem.id}>
            <SimpleDivider />
            <BacklogItemCard
                key={buildBacklogItemKey(backlogItem)}
                busySplittingStory={busySplittingStory}
                buildItemMenu={sprintBacklogItemMenuBuilder(eventHandlers)}
                estimate={backlogItem.estimate}
                hasDetails={editMode === EditMode.Edit}
                internalId={`${backlogItem.id}`}
                isDraggable={false}
                itemId={buildBacklogDisplayId(backlogItem.externalId, backlogItem.friendlyId)}
                itemType={backlogItem.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                marginBelowItem
                partIndex={backlogItem.partIndex}
                reasonText={backlogItem.reasonPhrase}
                renderMobile={renderMobile}
                roleText={backlogItem.rolePhrase}
                showDetailMenu={backlogItem.id === openedDetailMenuBacklogItemId}
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
    ));
};
