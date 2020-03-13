// externals
import React, { Component, ChangeEvent } from "react";

// style
import css from "./LabeledInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export interface LabeledInputStateProps {
    className?: string;
    inputId: string;
    inputName?: string;
    inputValue: string;
    labelText: string;
    placeHolder?: string;
    required?: boolean;
    size?: number;
}

export interface LabeledInputDispatchProps {
    onChange?: { (value: string) };
}

export type LabeledInputProps = LabeledInputStateProps & LabeledInputDispatchProps;

export class LabeledInput extends Component<LabeledInputProps> {
    constructor(props) {
        super(props);
    }
    handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }
    render() {
        const nameToUse = this.props.inputName || this.props.inputId;
        const valueToUse = this.props.inputValue || "";
        const classToUse = buildClassName(css.input, this.props.className);
        return (
            <div className={classToUse}>
                <input
                    id={this.props.inputId}
                    name={nameToUse}
                    type="text"
                    placeholder={this.props.placeHolder}
                    size={this.props.size}
                    value={valueToUse}
                    onChange={(e) => {
                        this.handleChange(e);
                    }}
                    required={this.props.required}
                />
                <label htmlFor={this.props.inputName}>{this.props.labelText}</label>
            </div>
        );
    }
}
