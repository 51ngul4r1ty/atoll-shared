// interfaces/types
import { ProductBacklogItem } from "../reducers/productBacklogItemsReducer";

// state
import { StateTree } from "../reducers/rootReducer";

export const getProductBacklogItems = (state: StateTree): ProductBacklogItem[] => {
    return state.productBacklogItems.items;
};
