// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { InnerApp } from "./InnerApp";
import { AppState } from "./store/app/types";

const mapStateToProps = (state: AppState) => {
    return {
        something: "to make it happy"
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onClick: (itemId: string) => {
            /* dispatch goes here */
        }
    };
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InnerApp);
