// externals
import React, { forwardRef, ChangeEvent, FocusEvent, RefObject, Ref, useState, useEffect } from "react";

// style
import css from "./DateTimeInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { usePrevious } from "../../common/usePreviousHook";

// interfaces/types
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

export type DateTimeInputRefType = HTMLInputElement;

export type DateTimeInputType = ComponentWithForwardedRef<DateTimeInputProps>;

export interface DateTimeInputStateProps {
    className?: string;
    disabled?: boolean;
    inputId: string;
    inputName?: string;
    labelText: string;
    placeHolder?: string;
    readOnly?: boolean;
    required?: boolean;
    showPicker?: boolean;
    showTime?: boolean;
    size?: number;
    inputValue: Date | null;
    type?: string;
    validator?: { (value: string): boolean };
}

export interface DateTimeInputDispatchProps {
    onChange?: { (value: string): void };
    onEnterKeyPress?: { () };
    onKeyPress?: { (keyCode: number) };
}

export type DateTimeInputProps = DateTimeInputStateProps & DateTimeInputDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface DateTimeInputInnerStateProps {
    innerRef: RefObject<DateTimeInputRefType>;
}

export const formatDateAsText = (date: Date | null, showTime?: boolean): string => {
    if (!date) {
        return "";
    }
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    const dateTimeString = `${datePart} ${timePart}`;
    return showTime ? dateTimeString : datePart;
};

export const InnerDateTimeInput: React.FC<DateTimeInputProps & DateTimeInputInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = formatDateAsText(props.inputValue) || inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(formatDateAsText(props.inputValue, props.showTime) || "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    const propagateTextChange = (inputText: string, lastValidInputText?: string) => {
        setInputText(inputText);
        if (props.onChange) {
            if (lastValidInputText === undefined) {
                props.onChange(inputText);
            } else {
                props.onChange(lastValidInputText);
            }
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let lastValidInputText = validInputText;
        if (props.validator && !props.validator(e.target.value)) {
            setIsValid(false);
        } else {
            setValidInputText(e.target.value);
            lastValidInputText = e.target.value;
            setIsValid(true);
        }
        propagateTextChange(e.target.value, lastValidInputText);
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
                data-class="date-input"
                data-id={props.inputId}
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
                tabIndex={0}
            />
            <label htmlFor={nameToUse}>{props.labelText}</label>
        </div>
    );
};

export const DateTimeInput: DateTimeInputType = forwardRef<DateTimeInputRefType, DateTimeInputProps>(
    (props: DateTimeInputProps, ref: Ref<DateTimeInputRefType>) => (
        <InnerDateTimeInput innerRef={ref as RefObject<DateTimeInputRefType>} {...props} />
    )
);
