// externals
import React, { forwardRef, Component, ChangeEvent, RefObject, Ref } from "react";

// style
import css from "./Checkbox.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { ComponentWithForwardedRef } from "../../../types";

export type CheckboxRefType = HTMLInputElement;

export type CheckboxType = ComponentWithForwardedRef<CheckboxProps>;

export interface CheckboxStateProps {
    className?: string;
    checked?: boolean;
    checkedValue?: string;
    disabled?: boolean;
    inputName?: string;
    inputId: string;
    labelText: string;
}

// NOTE: Keep this private so that it isn't referenced outside this component
interface CheckboxInnerStateProps {
    innerRef: RefObject<CheckboxRefType>;
}

export interface CheckboxDispatchProps {
    onChange?: { (value: string) };
}

export type CheckboxProps = CheckboxStateProps & CheckboxDispatchProps;

export class InnerCheckbox extends Component<CheckboxProps & CheckboxInnerStateProps> {
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
        const valueToUse = this.props.checkedValue || "checked";
        const classToUse = buildClassName(css.input, this.props.className, this.props.disabled ? css.disabled : null);
        return (
            <div className={classToUse}>
                <input
                    id={this.props.inputId}
                    name={nameToUse}
                    type="checkbox"
                    value={valueToUse}
                    onChange={(e) => {
                        this.handleChange(e);
                    }}
                />
                <label htmlFor={nameToUse}>{this.props.labelText}</label>
            </div>
        );
    }
}

export const Checkbox: CheckboxType = forwardRef((props: CheckboxProps, ref: Ref<CheckboxRefType>) => (
    <InnerCheckbox innerRef={ref as RefObject<CheckboxRefType>} {...props} />
));
