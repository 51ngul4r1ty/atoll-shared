// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { LoginView, LoginViewStateProps, LoginViewDispatchProps } from "./LoginView";

// state
import { StateTree } from "./types";

// actions
import { loginUser, setUsername, setPassword } from "./actions/appActions";

const mapStateToProps = (state: StateTree): LoginViewStateProps => {
    let result: LoginViewStateProps = {
        username: state.app.username,
        password: state.app.password
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): LoginViewDispatchProps => {
    return {
        onChangeUsername: (username: string) => dispatch(setUsername(username)),
        onChangePassword: (password: string) => dispatch(setPassword(password)),
        onLoginClick: () => dispatch(loginUser())
    };
};

export const LoginViewContainer = connect(mapStateToProps, mapDispatchToProps)(LoginView);
