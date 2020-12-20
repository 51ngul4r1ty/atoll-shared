// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { ReviewView, ReviewViewDispatchProps, ReviewViewStateProps } from "./ReviewView";
import { StateTree } from "../reducers/rootReducer";

// utils
import { isPlatformWindows } from "../utils/osUtils";

const mapStateToProps = (state: StateTree): ReviewViewStateProps => {
    let result: ReviewViewStateProps = {
        editMode: state.app.editMode,
        electronClient: state.app.electronClient,
        showWindowTitleBar: !isPlatformWindows()
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): ReviewViewDispatchProps => {
    return {};
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const ReviewViewContainer = connect(mapStateToProps, mapDispatchToProps)(ReviewView);
