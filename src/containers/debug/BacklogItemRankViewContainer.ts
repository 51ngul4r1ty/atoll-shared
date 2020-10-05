// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { BacklogItemRankView, BacklogItemRankViewDispatchProps, BacklogItemRankViewStateProps } from "./BacklogItemRankView";

// state
import { StateTree } from "../../types";

// actions
import { apiGetBacklogItemRanks } from "../../actions/apiBacklogItemRanks";
import { buildGroups } from "./backlogItemRankViewUtils";

const mapStateToProps = (state: StateTree): BacklogItemRankViewStateProps => {
    const result: BacklogItemRankViewStateProps = {
        groups: buildGroups(state)
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
