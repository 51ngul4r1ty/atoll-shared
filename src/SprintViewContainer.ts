// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { SprintView, SprintViewDispatchProps, SprintViewStateProps } from "./SprintView";
import { StateTree } from "./types";

const mapStateToProps = (state: StateTree): SprintViewStateProps => {
    let result: SprintViewStateProps = {
        editMode: state.app.editMode
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): SprintViewDispatchProps => {
    return {};
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const SprintViewContainer = connect(mapStateToProps, mapDispatchToProps)(SprintView);
