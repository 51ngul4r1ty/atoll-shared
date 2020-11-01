// externals
import * as React from "react";

// interfaces/types
import { ItemMenuBuilder, ItemMenuEventHandlers } from "../molecules/cards/BacklogItemCard";

// components
import { ProductBacklogItemMenu } from "../molecules/menus/ProductBacklogItemMenu";

export const productBacklogItemMenuBuilder: ItemMenuBuilder = (
    itemId: string,
    showMenuToLeft: boolean,
    eventHandlers: ItemMenuEventHandlers
) => (
    <ProductBacklogItemMenu
        showDetailMenuToLeft={showMenuToLeft}
        onEditItemClicked={() => eventHandlers.onEditItemClicked(itemId)}
        onRemoveItemClicked={() => eventHandlers.onRemoveItemClicked(itemId)}
    />
);
