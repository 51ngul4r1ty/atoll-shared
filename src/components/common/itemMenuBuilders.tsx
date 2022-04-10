// externals
import * as React from "react";

// interfaces/types
import type { ItemMenuBuilder, ItemMenuEventHandlers } from "../molecules/menus/menuBuilderTypes";

// components
import { BacklogItemPartMenu } from "../molecules/menus/BacklogItemPartMenu";
import { ProductBacklogItemMenu } from "../molecules/menus/ProductBacklogItemMenu";
import { SprintBacklogItemMenu } from "../molecules/menus/SprintBacklogItemMenu";
import { SprintMenu } from "../molecules/menus/SprintMenu";

export const productBacklogItemMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean
) => (
    <ProductBacklogItemMenu
        isJoinItemClickAvailable={() => eventHandlers.isEventSupported("onJoinItemClick")}
        showDetailMenuToLeft={showMenuToLeft}
        busyJoiningUnallocatedParts={eventHandlers.isEventHandlerWaiting?.("onJoinItemClick")}
        onEditItemClick={() => eventHandlers.handleEvent("onEditItemClick", itemId)}
        onRemoveItemClick={() => eventHandlers.handleEvent("onRemoveItemClick", itemId)}
        onJoinItemClick={() => eventHandlers.handleEvent("onJoinItemClick", itemId)}
    />
);

export const sprintBacklogItemMenuBuilder = (
    eventHandlers: ItemMenuEventHandlers,
    splitToNextSprintAvailable: boolean
): ItemMenuBuilder => (itemId: string, showMenuToLeft: boolean) => {
    return (
        <SprintBacklogItemMenu
            menuDisabled={eventHandlers.isEventSupported && !eventHandlers.isEventSupported()}
            showDetailMenuToLeft={showMenuToLeft}
            busySplittingStory={eventHandlers.isEventHandlerWaiting?.("onSplitBacklogItemClick")}
            splitToNextSprintAvailable={splitToNextSprintAvailable}
            onMoveItemToBacklogClick={() => eventHandlers.handleEvent("onMoveItemToBacklogClick", itemId)}
            onSplitBacklogItemClick={() => eventHandlers.handleEvent("onSplitBacklogItemClick", itemId)}
            onBacklogItemAcceptedClick={() => eventHandlers.handleEvent("onBacklogItemAcceptedClick", itemId)}
            onBacklogItemDoneClick={() => eventHandlers.handleEvent("onBacklogItemDoneClick", itemId)}
            onBacklogItemInProgressClick={() => eventHandlers.handleEvent("onBacklogItemInProgressClick", itemId)}
            onBacklogItemNotStartedClick={() => eventHandlers.handleEvent("onBacklogItemNotStartedClick", itemId)}
            onBacklogItemReleasedClick={() => eventHandlers.handleEvent("onBacklogItemReleasedClick", itemId)}
        />
    );
};

export const sprintMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean
) => (
    <SprintMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClick={() => eventHandlers.handleEvent("onEditItemClick", itemId)}
        onRemoveItemClick={() => eventHandlers.handleEvent("onRemoveItemClick", itemId)}
        onArchiveItemClick={() => eventHandlers.handleEvent("onArchiveItemClick", itemId)}
        onUnarchiveItemClick={() => eventHandlers.handleEvent("onUnarchiveItemClick", itemId)}
    />
);

export const backlogItemPartMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean
) => (
    <BacklogItemPartMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClick={() => eventHandlers.handleEvent("onEditItemClick", itemId)}
    />
);
