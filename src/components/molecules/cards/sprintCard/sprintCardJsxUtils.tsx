// externals
import * as React from "react";

// interfaces/types
import { SprintBacklogItem } from "../../../../reducers/sprintBacklogReducer";

// components
import { BacklogItemCard, BacklogItemTypeEnum, buildBacklogItemKey, calcItemId, ItemMenuEventHandlers } from "../BacklogItemCard";

// consts/enums
import { EditMode } from "../../buttons/EditButton";

// utils
import { sprintBacklogItemMenuBuilder } from "../../../common/itemMenuBuilders";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    showDetailMenuToLeft: boolean,
    backlogItems: SprintBacklogItem[],
    onDetailClicked: { (backlogItemId: string) },
    onMoveItemToBacklogClicked: { (itemId: string) },
    onBacklogItemDoneClicked: { (itemId: string) },
    onBacklogItemInProgressClicked: { (itemId: string) }
) => {
    const eventHandlers: ItemMenuEventHandlers = {
        handleEvent: (eventName: string, itemId: string) => {
            if (eventName === "onMoveItemToBacklogClicked") {
                onMoveItemToBacklogClicked(itemId);
            } else if (eventName === "onBacklogItemDoneClicked") {
                onBacklogItemDoneClicked(itemId);
            } else if (eventName === "onBacklogItemInProgressClicked") {
                onBacklogItemInProgressClicked(itemId);
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
                internalId={`${backlogItem.id}`}
                itemId={calcItemId(backlogItem.externalId, backlogItem.friendlyId)}
                itemType={backlogItem.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                titleText={backlogItem.storyPhrase}
                isDraggable={false}
                hasDetails={editMode === EditMode.Edit}
                renderMobile={renderMobile}
                marginBelowItem
                showDetailMenu={backlogItem.id === openedDetailMenuBacklogItemId}
                showDetailMenuToLeft={showDetailMenuToLeft}
                status={backlogItem.status}
                onDetailClicked={() => {
                    onDetailClicked(backlogItem.id);
                }}
            />
        </div>
    ));
};
