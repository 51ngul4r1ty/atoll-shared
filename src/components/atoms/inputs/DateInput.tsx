// externals
import React, { forwardRef, ChangeEvent, FocusEvent, RefObject, Ref, useState, useEffect } from "react";

// style
import css from "./DateInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { usePrevious } from "../../common/usePreviousHook";
import { ItemMenuPanel, ItemMenuPanelCaretPosition, ItemMenuPanelColor } from "../panels/ItemMenuPanel";
import { getEltDataAttribute, getParentWithDataClass, hasParentWithDataClass } from "../../common/domUtils";

// components
import { SprintDatePicker, SprintDatePickerMode } from "../../molecules/pickers/SprintDatePicker";

// interfaces/types
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";
import { DateOnly } from "../../../types/dateTypes";

export type DateInputRefType = HTMLInputElement;

export type DateInputType = ComponentWithForwardedRef<DateInputProps>;

export enum DateInputPickerMode {
    SingleDateRangeAltUnused = 1,
    RangeAltIsFinishDate = 2,
    RangeAltIsStartDate = 3
}

export interface DateInputStateProps {
    caretPosition?: ItemMenuPanelCaretPosition;
    className?: string;
    disabled?: boolean;
    rangeAltValue?: DateOnly | null;
    inputId: string;
    inputName?: string;
    labelText: string;
    pickerMode?: DateInputPickerMode;
    placeHolder?: string;
    readOnly?: boolean;
    required?: boolean;
    showPicker?: boolean;
    size?: number;
    inputValue: DateOnly | null;
    type?: string;
    validator?: { (value: string): boolean };
}

export interface DateInputDispatchProps {
    onChange?: { (value: string): void };
    onEnterKeyPress?: { () };
    onKeyPress?: { (keyCode: number) };
}

export type DateInputProps = DateInputStateProps & DateInputDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface DateInputInnerStateProps {
    innerRef: RefObject<DateInputRefType>;
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

export const InnerDateInput: React.FC<DateInputProps & DateInputInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = props.inputValue ? props.inputValue.formatAsText() : inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(props.inputValue ? props.inputValue.formatAsText() : "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    const [showingPicker, setShowingPicker] = useState(props.showPicker);
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
    const handleInputFocus = (e: FocusEvent<HTMLDivElement>) => {
        setShowingPicker(true);
    };
    const handleInputFocusLost = (e: FocusEvent<HTMLDivElement>) => {
        const eltReceivingFocus = e.relatedTarget as HTMLElement;
        if (!hasParentWithDataClass(eltReceivingFocus, "date-picker")) {
            setShowingPicker(false);
        }
    };
    const handleDatePickerFocusLost = (e: FocusEvent<HTMLDivElement>) => {
        const eltReceivingFocus = e.relatedTarget as HTMLElement;
        const parentDateInput = getParentWithDataClass(eltReceivingFocus, "date-input");
        if (parentDateInput) {
            const id = getEltDataAttribute(parentDateInput, "id");
            if (props.inputId !== id) {
                setShowingPicker(false);
            }
        } else {
            setShowingPicker(false);
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
    const showPicker = props.pickerMode && props.pickerMode !== DateInputPickerMode.SingleDateRangeAltUnused;
    const pickerMode =
        props.pickerMode === DateInputPickerMode.RangeAltIsFinishDate
            ? SprintDatePickerMode.StartDate
            : SprintDatePickerMode.FinishDate;
    const startDateToUse = props.pickerMode === DateInputPickerMode.RangeAltIsStartDate ? props.rangeAltValue : props.inputValue;
    const finishDateToUse = props.pickerMode === DateInputPickerMode.RangeAltIsFinishDate ? props.rangeAltValue : props.inputValue;
    const datePickerElts = !showPicker ? null : (
        <div
            data-class="date-picker"
            className={buildClassName(
                css.picker,
                showingPicker ? css.show : css.hide,
                props.caretPosition === ItemMenuPanelCaretPosition.TopRight ? css.caretTopRight : null
            )}
            tabIndex={1}
            onBlur={(e) => {
                handleDatePickerFocusLost(e);
            }}
        >
            <ItemMenuPanel
                caretPosition={props.caretPosition || ItemMenuPanelCaretPosition.TopLeft}
                panelColor={ItemMenuPanelColor.Dark}
            >
                <SprintDatePicker
                    startDate={startDateToUse}
                    finishDate={finishDateToUse}
                    pickerMode={pickerMode}
                    suppressPadding
                    onStartDateChange={(date: DateOnly) => {
                        propagateTextChange(date.formatAsText());
                    }}
                    onFinishDateChange={(date: DateOnly) => {
                        propagateTextChange(date.formatAsText());
                    }}
                />
            </ItemMenuPanel>
        </div>
    );
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
                onFocus={(e) => {
                    handleInputFocus(e);
                }}
                onBlur={(e) => {
                    handleInputFocusLost(e);
                }}
                required={props.required}
                tabIndex={0}
            />
            <label htmlFor={nameToUse}>{props.labelText}</label>
            {datePickerElts}
        </div>
    );
};

export const DateInput: DateInputType = forwardRef<DateInputRefType, DateInputProps>(
    (props: DateInputProps, ref: Ref<DateInputRefType>) => (
        <InnerDateInput innerRef={ref as RefObject<DateInputRefType>} {...props} />
    )
);
