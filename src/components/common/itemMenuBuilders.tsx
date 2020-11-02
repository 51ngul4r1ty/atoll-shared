// externals
import * as React from "react";

// interfaces/types
import { ItemMenuBuilder, ItemMenuEventHandlers } from "../molecules/cards/BacklogItemCard";

// components
import { ProductBacklogItemMenu } from "../molecules/menus/ProductBacklogItemMenu";
import { SprintBacklogItemMenu } from "../molecules/menus/SprintBacklogItemMenu";

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
    />
);
