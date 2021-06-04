// externals
import * as React from "react";

// interfaces/types
import { ItemMenuBuilder, ItemMenuEventHandlers } from "../molecules/cards/BacklogItemCard";

// components
import { ProductBacklogItemMenu } from "../molecules/menus/ProductBacklogItemMenu";
import { SprintBacklogItemMenu } from "../molecules/menus/SprintBacklogItemMenu";
import { SprintMenu } from "../molecules/menus/SprintMenu";

export const productBacklogItemMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean,
    menuDisabled: boolean,
    busyButtonName: string
) => (
    <ProductBacklogItemMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClick={() => eventHandlers.handleEvent("onEditItemClick", itemId)}
        onRemoveItemClick={() => eventHandlers.handleEvent("onRemoveItemClick", itemId)}
    />
);

export const sprintBacklogItemMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean,
    menuDisabled: boolean,
    busyButtonName: string
) => (
    <SprintBacklogItemMenu
        menuDisabled={menuDisabled}
        showDetailMenuToLeft={showMenuToLeft}
        busySplittingStory={busyButtonName === "splitStory"}
        onMoveItemToBacklogClick={() => eventHandlers.handleEvent("onMoveItemToBacklogClick", itemId)}
        onSplitBacklogItemClick={() => eventHandlers.handleEvent("onSplitBacklogItemClick", itemId)}
        onBacklogItemAcceptedClick={() => eventHandlers.handleEvent("onBacklogItemAcceptedClick", itemId)}
        onBacklogItemDoneClick={() => eventHandlers.handleEvent("onBacklogItemDoneClick", itemId)}
        onBacklogItemInProgressClick={() => eventHandlers.handleEvent("onBacklogItemInProgressClick", itemId)}
        onBacklogItemNotStartedClick={() => eventHandlers.handleEvent("onBacklogItemNotStartedClick", itemId)}
        onBacklogItemReleasedClick={() => eventHandlers.handleEvent("onBacklogItemReleasedClick", itemId)}
    />
);

export const sprintMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean,
    menuDisabled: boolean,
    busyButtonName: string
) => (
    <SprintMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClick={() => eventHandlers.handleEvent("onEditItemClick", itemId)}
        onRemoveItemClick={() => eventHandlers.handleEvent("onRemoveItemClick", itemId)}
        onArchiveItemClick={() => eventHandlers.handleEvent("onArchiveItemClick", itemId)}
        onUnarchiveItemClick={() => eventHandlers.handleEvent("onUnarchiveItemClick", itemId)}
    />
);
