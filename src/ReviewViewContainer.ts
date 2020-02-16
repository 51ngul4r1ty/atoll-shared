// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { ReviewView, ReviewViewDispatchProps, ReviewViewStateProps } from "./ReviewView";
import { StateTree } from "./types";

const mapStateToProps = (state: StateTree): ReviewViewStateProps => {
    let result: ReviewViewStateProps = {};
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
