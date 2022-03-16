// externals
import React, { forwardRef, ChangeEvent, RefObject, Ref, useState, KeyboardEvent, useEffect } from "react";

// style
import css from "./StandardInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { usePrevious } from "../../common/usePreviousHook";

// interfaces/types
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

export type StandardInputRefType = HTMLInputElement;

export type StandardInputType = ComponentWithForwardedRef<StandardInputProps>;

export interface StandardInputStateProps {
    className?: string;
    disabled?: boolean;
    inputId: string;
    inputName?: string;
    inputValue?: string | number | null;
    labelText: string;
    placeHolder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    type?: string;
    validator?: { (value: string): boolean };
}

export interface StandardInputDispatchProps {
    onChange?: { (value: string): void };
    onEnterKeyPress?: { () };
    onKeyPress?: { (keyCode: number) };
}

export type StandardInputProps = StandardInputStateProps & StandardInputDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface StandardInputInnerStateProps {
    innerRef: RefObject<StandardInputRefType>;
}

export const InnerStandardInput: React.FC<StandardInputProps & StandardInputInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = props.inputValue || inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(props.inputValue ? `${props.inputValue}` : "");
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
    const handleKeyUp = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (props.onEnterKeyPress) {
                props.onEnterKeyPress();
            }
        }
        if (props.onKeyPress) {
            props.onKeyPress(event.keyCode);
        }
    };
    useEffect(() => {
        if (props.innerRef?.current) {
            props.innerRef.current.addEventListener("keyup", handleKeyUp.bind(this));
        }
        return function cleanup() {
            if (props.innerRef?.current) {
                props.innerRef.current.removeEventListener("keyup", handleKeyUp);
            }
        };
    });
    const prevProps = usePrevious({ inputValue: propsInputValueToUse });
    const prevState = usePrevious({ inputText });
    useEffect(() => {
        if (prevProps?.inputValue !== propsInputValueToUse && prevState?.inputText === inputText) {
            if (inputText !== propsInputValueToUse) {
                setInputText(propsInputValueToUse);
            }
        }
    }, [propsInputValueToUse, inputText]);
    const nameToUse = props.inputName || props.inputId;
    const classToUse = buildClassName(
        css.input,
        props.className,
        props.disabled ? css.disabled : null,
        isValid ? css.valid : css.invalid,
        props.readOnly ? css.readOnly : null
    );
    const typeToUse = props.type || "text";
    return (
        <div className={classToUse}>
            <input
                id={props.inputId}
                ref={props.innerRef}
                disabled={props.disabled || props.readOnly}
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
