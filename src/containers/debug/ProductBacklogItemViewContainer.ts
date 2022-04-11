// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import {
    ProductBacklogItemView,
    ProductBacklogItemViewDispatchProps,
    ProductBacklogItemViewStateProps
} from "./ProductBacklogItemView";

// state
import { StateTree } from "../../reducers/rootReducer";

// actions
import { apiGetProductBacklogItems } from "../../actions/apiProductBacklogItems";
import { buildGroups } from "./productBacklogItemViewUtils";

const mapStateToProps = (state: StateTree): ProductBacklogItemViewStateProps => {
    let groups = [];
    let error = undefined;
    try {
        groups = buildGroups(state);
    } catch (err) {
        error = err;
    }
    const result: ProductBacklogItemViewStateProps = {
        groups,
        error
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): ProductBacklogItemViewDispatchProps => {
    return {
        onLoad: () => {
            dispatch(apiGetProductBacklogItems());
        }
    };
};

export const ProductBacklogItemViewContainer = connect(mapStateToProps, mapDispatchToProps)(ProductBacklogItemView);
