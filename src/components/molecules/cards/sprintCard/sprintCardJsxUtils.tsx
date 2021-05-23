// externals
import * as React from "react";

// interfaces/types
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";

// components
import { BacklogItemCard, BacklogItemTypeEnum, buildBacklogItemKey, ItemMenuEventHandlers } from "../BacklogItemCard";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

// utils
import { sprintBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";
import { buildBacklogDisplayId } from "../../../../utils/backlogItemHelper";

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    showDetailMenuToLeft: boolean,
    backlogItems: SprintBacklogItem[],
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
