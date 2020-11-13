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

export const getBacklogItemElts = (
    editMode: EditMode,
    openedDetailMenuBacklogItemId: string,
    renderMobile: boolean,
    backlogItems: SprintBacklogItem[],
    onDetailClicked: { (backlogItemId: string) },
    onMoveItemToBacklogClicked: { (itemId: string) }
) => {
    const eventHandlers: ItemMenuEventHandlers = {
        handleEvent: (eventName: string, itemId: string) => {
            if (eventName === "onMoveItemToBacklogClicked") {
                onMoveItemToBacklogClicked(itemId);
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
                showDetailMenuToLeft
                onDetailClicked={() => {
                    onDetailClicked(backlogItem.id);
                }}
            />
        </div>
    ));
};
