// externals
import * as React from "react";
import Helmet from "react-helmet";

// components
import { LoginForm } from "../components/organisms/forms/LoginForm";

// style
import css from "./LoginView.module.css";

/* exported interface */

export interface LoginViewStateProps {
    username: string;
    password: string;
}

export interface LoginViewDispatchProps {
    onChangeUsername: { (username: string) };
    onChangePassword: { (password: string) };
    onLoginClick: { () };
}

export type LoginViewProps = LoginViewStateProps & LoginViewDispatchProps;

/* exported component */

export class LoginView extends React.Component<LoginViewProps, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <Helmet>
                    <title>Login Page</title>
                    <meta name="description" content="Allows a user to sign into the Atoll application." />
                </Helmet>
                <div className={css.page}>
                    <div className={css.form}>
                        <div />
                        <div className={css.spacedRow}>
                            <div />
                            <div>
                                <LoginForm
                                    username={this.props.username}
                                    password={this.props.password}
                                    onUsernameChange={(username: string) => {
                                        this.props.onChangeUsername(username);
                                    }}
                                    onPasswordChange={(password: string) => {
                                        this.props.onChangePassword(password);
                                    }}
                                    onLoginClick={() => {
                                        this.props.onLoginClick();
                                    }}
                                />
                            </div>
                            <div />
                        </div>
                        <div />
                    </div>
                </div>
            </>
        );
    }
}
