// externals
import React, { Component, RefObject } from "react";

// components
import { StandardInput, StandardInputRefType } from "../../atoms/inputs/StandardInput";
import { DoneButton, DoneButtonRefType } from "../../molecules/buttons/DoneButton";

// style
import commonCss from "./common/common.module.css";
import css from "./LoginForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export interface LoginFormStateProps {
    className?: string;
    username: string;
    password: string;
}

export interface LoginFormDispatchProps {
    onLoginClick?: { () };
    onUsernameChange?: { (newValue: string) };
    onPasswordChange?: { (newValue: string) };
}

export type LoginFormProps = LoginFormStateProps & LoginFormDispatchProps;

export class LoginForm extends Component<LoginFormProps> {
    private formRef: RefObject<HTMLFormElement>;
    private passwordInputRef: RefObject<StandardInputRefType>;
    private usernameInputRef: RefObject<StandardInputRefType>;
    private doneButtonRef: RefObject<DoneButtonRefType>;
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.passwordInputRef = React.createRef();
        this.usernameInputRef = React.createRef();
        this.doneButtonRef = React.createRef();
    }
    handleLoginClick = () => {
        this.formRef.current.reportValidity();
        if (this.props.onLoginClick) {
            this.props.onLoginClick();
        }
    };
    render() {
        const usernameValue = this.props.username;
        const passwordValue = this.props.password;
        const formContent = (
            <section className={css.formFields}>
                <div className={buildClassName(css.userName, css.formRow)}>
                    <StandardInput
                        ref={this.usernameInputRef}
                        inputId="username"
                        labelText="Username"
                        size={30}
                        inputValue={usernameValue}
                        onChange={(value) => {
                            if (this.props.onUsernameChange) {
                                this.props.onUsernameChange(value);
                            }
                        }}
                        onEnterKeyPress={() => {
                            if (usernameValue) {
                                this.passwordInputRef.current.focus();
                            }
                        }}
                    />
                </div>
                <div className={buildClassName(css.password, css.formRow)}>
                    <StandardInput
                        ref={this.passwordInputRef}
                        inputId="password"
                        labelText="Password"
                        size={30}
                        inputValue={passwordValue}
                        type="password"
                        onChange={(value) => {
                            if (this.props.onPasswordChange) {
                                this.props.onPasswordChange(value);
                            }
                        }}
                        onEnterKeyPress={() => {
                            this.doneButtonRef.current.click();
                        }}
                    />
                </div>
            </section>
        );
        const formActions = (
            <section className={css.formActions}>
                <DoneButton ref={this.doneButtonRef} onClick={this.handleLoginClick} />
            </section>
        );
        return (
            <form ref={this.formRef} className={buildClassName(commonCss.form, css.form, this.props.className)}>
                {formContent}
                {formActions}
            </form>
        );
    }
}
