// externals
import React, { forwardRef, Component, ChangeEvent, RefObject, Ref } from "react";

// style
import css from "./LabeledInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { ComponentWithForwardedRef } from "../../../types";

export type LabeledInputRefType = HTMLInputElement;

export type LabeledInputType = ComponentWithForwardedRef<LabeledInputProps>;

export interface LabeledInputStateProps {
    className?: string;
    inputId: string;
    inputName?: string;
    inputValue: string;
    labelText: string;
    placeHolder?: string;
    required?: boolean;
    size?: number;
    type?: string;
}

// NOTE: Keep this private so that it isn't referenced outside this component
interface LabeledInputInnerStateProps {
    innerRef: RefObject<LabeledInputRefType>;
}

export interface LabeledInputDispatchProps {
    onChange?: { (value: string) };
    onEnterKeyPress?: { () };
    onKeyPress?: { (keyCode: number) };
}

export type LabeledInputProps = LabeledInputStateProps & LabeledInputDispatchProps;

export class InnerLabeledInput extends Component<LabeledInputProps & LabeledInputInnerStateProps> {
    constructor(props) {
        super(props);
    }
    handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.props.onEnterKeyPress) {
                this.props.onEnterKeyPress();
            }
        }
        if (this.props.onKeyPress) {
            this.props.onKeyPress(event.keyCode);
        }
    }
    componentDidMount() {
        if (this.props.innerRef?.current) {
            this.props.innerRef.current.addEventListener("keyup", this.handleKeyUp.bind(this));
        }
    }
    componentWillUnmount() {
        if (this.props.innerRef?.current) {
            this.props.innerRef.current.removeEventListener("keyup", this.handleKeyUp);
        }
    }
    render() {
        const nameToUse = this.props.inputName || this.props.inputId;
        const valueToUse = this.props.inputValue || "";
        const classToUse = buildClassName(css.input, this.props.className);
        const typeToUse = this.props.type || "text";
        return (
            <div className={classToUse}>
                <input
                    id={this.props.inputId}
                    ref={this.props.innerRef}
                    name={nameToUse}
                    type={typeToUse}
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

export const LabeledInput: LabeledInputType = forwardRef((props: LabeledInputProps, ref: Ref<LabeledInputRefType>) => (
    <InnerLabeledInput innerRef={ref as RefObject<LabeledInputRefType>} {...props} />
));
