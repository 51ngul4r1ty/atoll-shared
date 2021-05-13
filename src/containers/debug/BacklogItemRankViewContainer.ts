// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { BacklogItemRankView, BacklogItemRankViewDispatchProps, BacklogItemRankViewStateProps } from "./BacklogItemRankView";

// state
import { StateTree } from "../../reducers/rootReducer";

// actions
import { apiGetBacklogItemRanks } from "../../actions/apiBacklogItemRanks";
import { buildGroups } from "./backlogItemRankViewUtils";

const mapStateToProps = (state: StateTree): BacklogItemRankViewStateProps => {
    let groups = [];
    let error = undefined;
    try {
        groups = buildGroups(state);
    } catch (err) {
        error = err;
    }
    const result: BacklogItemRankViewStateProps = {
        groups,
        error
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BacklogItemRankViewDispatchProps => {
    return {
        onLoad: () => {
            dispatch(apiGetBacklogItemRanks());
        }
    };
};

export const BacklogItemRankViewContainer = connect(mapStateToProps, mapDispatchToProps)(BacklogItemRankView);
