// externals
import React, { forwardRef, ChangeEvent, RefObject, Ref, useState } from "react";

// style
import css from "./Checkbox.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

// components
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "../icons";

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

export interface CheckboxDispatchProps {
    onChange?: { (checked: boolean, value?: string): void };
}

export type CheckboxProps = CheckboxStateProps & CheckboxDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface CheckboxInnerStateProps {
    innerRef: RefObject<CheckboxRefType>;
}

export const InnerCheckbox: React.FC<CheckboxProps & CheckboxInnerStateProps> = (props) => {
    const [isChecked, setIsChecked] = useState(props.checked || false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        if (props.onChange) {
            const newCheckedState = e.target.checked;
            props.onChange(newCheckedState, e.target.value);
        }
    };
    const nameToUse = props.inputName || props.inputId;
    const valueToUse = props.checkedValue || "checked";
    const classToUse = buildClassName(css.input, props.className, props.disabled ? css.disabled : null);
    const iconProps = {
        includedSvgAttributes: [
            { name: "aria-hidden", value: "true" },
            { name: "focusable", value: "false" }
        ]
    };
    const icon = isChecked ? <CheckboxCheckedIcon {...iconProps} /> : <CheckboxUncheckedIcon {...iconProps} />;
    return (
        <div className={classToUse}>
            <div className={css.outerWrapper}>
                <div className={css.innerWrapper}>
                    {icon}
                    {props.labelText ? <label htmlFor={nameToUse}>{props.labelText}</label> : null}
                </div>
                <input
                    id={props.inputId}
                    name={nameToUse}
                    type="checkbox"
                    value={valueToUse}
                    checked={isChecked}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
            </div>
        </div>
    );
};

export const Checkbox: CheckboxType = forwardRef((props: CheckboxProps, ref: Ref<CheckboxRefType>) => (
    <InnerCheckbox innerRef={ref as RefObject<CheckboxRefType>} {...props} />
));
