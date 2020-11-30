// externals
import React, { forwardRef, ChangeEvent, RefObject, Ref, useState } from "react";

// style
import css from "./StandardInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { ComponentWithForwardedRef } from "../../../types";

export type StandardInputRefType = HTMLInputElement;

export type StandardInputType = ComponentWithForwardedRef<StandardInputProps>;

export interface StandardInputStateProps {
    className?: string;
    disabled?: boolean;
    inputId: string;
    inputName?: string;
    labelText: string;
    placeHolder?: string;
    required?: boolean;
    size?: number;
    type?: string;
    inputValue?: string;
    validator?: { (value: string): boolean };
}

export interface StandardInputDispatchProps {
    onChange?: { (value: string): void };
}

export type StandardInputProps = StandardInputStateProps & StandardInputDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface StandardInputInnerStateProps {
    innerRef: RefObject<StandardInputRefType>;
}

export const InnerStandardInput: React.FC<StandardInputProps & StandardInputInnerStateProps> = (props) => {
    const [inputText, setInputText] = useState(props.inputValue || "");
    const [validInputText, setValidInputText] = useState(props.inputValue || "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let lastValidInputText = validInputText;
        if (props.validator && !props.validator(e.target.value)) {
            setIsValid(false);
        } else {
            setValidInputText(e.target.value);
            lastValidInputText = e.target.value;
            setIsValid(true);
        }

        setInputText(e.target.value);
        if (props.onChange) {
            props.onChange(lastValidInputText);
        }
    };
    const nameToUse = props.inputName || props.inputId;
    const classToUse = buildClassName(
        css.input,
        props.className,
        props.disabled ? css.disabled : null,
        isValid ? css.valid : css.invalid
    );
    const typeToUse = props.type || "text";
    return (
        <div className={classToUse}>
            <input
                id={props.inputId}
                ref={props.innerRef}
                disabled={props.disabled}
                name={nameToUse}
                type={typeToUse}
                placeholder={props.placeHolder}
                size={props.size}
                value={inputText}
                onChange={(e) => {
                    handleChange(e);
                }}
                required={props.required}
            />
            <label htmlFor={nameToUse}>{props.labelText}</label>
        </div>
    );
};

export const StandardInput: StandardInputType = forwardRef((props: StandardInputProps, ref: Ref<StandardInputRefType>) => (
    <InnerStandardInput innerRef={ref as RefObject<StandardInputRefType>} {...props} />
));
