// externals
import React, { forwardRef, ChangeEvent, RefObject, Ref, useState, KeyboardEvent, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// style
import css from "./StandardTextArea.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { usePrevious } from "../../common/usePreviousHook";

// interfaces/types
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

export type StandardTextAreaRefType = HTMLTextAreaElement;

export type StandardTextAreaType = ComponentWithForwardedRef<StandardTextAreaProps>;

export interface StandardTextAreaStateProps {
    allowVerticalResize?: boolean;
    className?: string;
    disabled?: boolean;
    inputId: string;
    inputName?: string;
    inputValue?: string;
    labelText: string;
    placeHolder?: string;
    readOnly?: boolean;
    renderMarkdown?: boolean;
    required?: boolean;
    rows?: number;
    type?: string;
    validator?: { (value: string): boolean };
}

export interface StandardTextAreaDispatchProps {
    onChange?: { (value: string): void };
    onEnterKeyPress?: { () };
    onKeyPress?: { (keyCode: number) };
}

export type StandardTextAreaProps = StandardTextAreaStateProps & StandardTextAreaDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface StandardTextAreaInnerStateProps {
    innerRef: RefObject<StandardTextAreaRefType>;
}

export const InnerStandardTextArea: React.FC<StandardTextAreaProps & StandardTextAreaInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = props.inputValue || inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(props.inputValue || "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
        props.readOnly ? css.readOnly : null,
        !props.allowVerticalResize ? css.noVertResize : null
    );
    const buildTextArea = (value: string = inputText) => (
        <textarea
            id={props.inputId}
            ref={props.innerRef}
            disabled={props.disabled || props.readOnly}
            name={nameToUse}
            placeholder={props.placeHolder}
            rows={props.rows}
            value={value}
            onChange={(e) => {
                handleChange(e);
            }}
            required={props.required}
        />
    );
    const buildMarkdown = () => {
        return inputText === "-" ? (
            <div id={props.inputId} className={css.acceptanceCriteriaEmpty}>
                -
            </div>
        ) : (
            <div id={props.inputId} className={css.markdownContainer}>
                <ReactMarkdown className={css.markdown} linkTarget="_blank">
                    {inputText}
                </ReactMarkdown>
            </div>
        );
    };
    const innerComponent = props.renderMarkdown ? buildMarkdown() : buildTextArea();
    return (
        <div className={classToUse}>
            {innerComponent}
            <label htmlFor={nameToUse}>{props.labelText}</label>
        </div>
    );
};

export const StandardTextArea: StandardTextAreaType = forwardRef(
    (props: StandardTextAreaProps, ref: Ref<StandardTextAreaRefType>) => (
        <InnerStandardTextArea innerRef={ref as RefObject<StandardTextAreaRefType>} {...props} />
    )
);
