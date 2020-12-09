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
    showMenuToLeft: boolean
) => (
    <ProductBacklogItemMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClicked={() => eventHandlers.handleEvent("onEditItemClicked", itemId)}
        onRemoveItemClicked={() => eventHandlers.handleEvent("onRemoveItemClicked", itemId)}
    />
);

export const sprintBacklogItemMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean
) => (
    <SprintBacklogItemMenu
        showDetailMenuToLeft={showMenuToLeft}
        onMoveItemToBacklogClicked={() => eventHandlers.handleEvent("onMoveItemToBacklogClicked", itemId)}
        onBacklogItemAcceptedClicked={() => eventHandlers.handleEvent("onBacklogItemAcceptedClicked", itemId)}
        onBacklogItemDoneClicked={() => eventHandlers.handleEvent("onBacklogItemDoneClicked", itemId)}
        onBacklogItemInProgressClicked={() => eventHandlers.handleEvent("onBacklogItemInProgressClicked", itemId)}
        onBacklogItemNotStartedClicked={() => eventHandlers.handleEvent("onBacklogItemNotStartedClicked", itemId)}
        onBacklogItemReleasedClicked={() => eventHandlers.handleEvent("onBacklogItemReleasedClicked", itemId)}
    />
);

export const sprintMenuBuilder = (eventHandlers: ItemMenuEventHandlers): ItemMenuBuilder => (
    itemId: string,
    showMenuToLeft: boolean
) => (
    <SprintMenu
        showDetailMenuToLeft={showMenuToLeft}
        // onEditItemClicked={() => eventHandlers.handleEvent("onEditItemClicked", itemId)}
        onRemoveItemClicked={() => eventHandlers.handleEvent("onRemoveItemClicked", itemId)}
        onArchiveItemClicked={() => eventHandlers.handleEvent("onArchiveItemClicked", itemId)}
        onUnarchiveItemClicked={() => eventHandlers.handleEvent("onUnarchiveItemClicked", itemId)}
    />
);
