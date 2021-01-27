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
import ReactDOM from "react-dom";

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
    itemType?: string;
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
    onInputFocus?: { (e: FocusEvent<HTMLDivElement>): void };
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

export const getModalPanelElt = () => document.getElementById("atollModalPanel");

export const buildModalComponentDivClassName = (relatedComponentId: string) => `ATOLL-TAG-MODAL-${relatedComponentId}`;

export const registerModalComponent = (relatedComponentId: string, modalComponentElt: JSX.Element) => {
    const relatedComponent = document.getElementById(relatedComponentId);
    const boundingRect = relatedComponent.getBoundingClientRect();
    console.log(`REGISTERING MODAL COMPONENT: ${relatedComponentId}`);
    const modalElt = getModalPanelElt();
    const tagNameKey = buildModalComponentDivClassName(relatedComponentId);
    const elts = modalElt.getElementsByClassName(tagNameKey);
    let parentElt: Element;
    if (!elts.length) {
        console.log(`  (added new component holder)`);
        const divNode = document.createElement("div");
        divNode.className = tagNameKey;
        modalElt.appendChild(divNode);
        parentElt = divNode;
    } else {
        console.log(`  (using existing component holder)`);
        parentElt = elts[0];
    }
    const parentEltAsDiv = parentElt as HTMLDivElement;
    parentEltAsDiv.style.position = "absolute";
    parentEltAsDiv.style.top = `${boundingRect.top}px`;
    parentEltAsDiv.style.left = `${boundingRect.left}px`;
    parentEltAsDiv.style.width = `${boundingRect.width}px`;
    parentEltAsDiv.style.height = "0";
    // parentEltAsDiv.style.height = `${boundingRect.height}px`;
    parentEltAsDiv.style.overflow = "visible";
    // parentEltAsDiv.style.pointerEvents = "none";
    ReactDOM.render(modalComponentElt, parentElt);
};

export const unregisterModalComponent = (relatedComponentId: string) => {
    console.log(`UNREGISTERING MODAL COMPONENT: ${relatedComponentId}`);
    const modalElt = getModalPanelElt();
    const tagNameKey = buildModalComponentDivClassName(relatedComponentId);
    const elts = modalElt.getElementsByClassName(tagNameKey);
    if (elts.length) {
        console.log(`  (found component holder)`);
        modalElt.removeChild(elts[0]);
        console.log(`  (removed component holder)`);
    }
};

export const InnerDateInput: React.FC<DateInputProps & DateInputInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = props.inputValue ? props.inputValue.formatAsText() : inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(props.inputValue ? props.inputValue.formatAsText() : "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    // const [showingPicker, setShowingPicker] = useState(props.showPicker);
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
        if (props.onInputFocus) {
            props.onInputFocus(e);
        }
        // setShowingPicker(true);
    };
    // const handleInputFocusLost = (e: FocusEvent<HTMLDivElement>) => {
    //     const eltReceivingFocus = e.relatedTarget as HTMLElement;
    //     const temp = e.currentTarget as HTMLElement;
    //     if (!hasParentWithDataClass(eltReceivingFocus, "date-picker")) {
    //         setShowingPicker(false);
    //     }
    // };
    // const handleDatePickerFocusLost = (e: FocusEvent<HTMLDivElement>) => {
    //     const eltReceivingFocus = e.relatedTarget as HTMLElement;
    //     if (eltReceivingFocus !== null) {
    //         const parentDateInput = getParentWithDataClass(eltReceivingFocus, "date-input");
    //         if (parentDateInput) {
    //             const id = getEltDataAttribute(parentDateInput, "id");
    //             if (props.inputId !== id) {
    //                 setShowingPicker(false);
    //             }
    //         } else {
    //             setShowingPicker(false);
    //         }
    //     }
    // };
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
    useEffect(() => {
        const relatedComponentId = props.inputId;
        registerModalComponent(
            relatedComponentId,
            <div
                data-class="date-picker"
                className={buildClassName(
                    css.picker,
                    props.showPicker ? css.show : css.hide,
                    props.caretPosition === ItemMenuPanelCaretPosition.TopRight ? css.caretTopRight : null
                )}
                tabIndex={1}
                onBlur={(e) => {
                    // handleDatePickerFocusLost(e);
                }}
            >
                <ItemMenuPanel
                    itemId={props.inputId}
                    itemType={props.itemType}
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
        return function cleanup() {
            unregisterModalComponent(relatedComponentId);
        };
    }, [showPicker, props.showPicker, startDateToUse, finishDateToUse, pickerMode]);
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
                    //                    handleInputFocusLost(e);
                }}
                required={props.required}
                tabIndex={0}
            />
            <label htmlFor={nameToUse}>{props.labelText}</label>
        </div>
    );
};

export const DateInput: DateInputType = forwardRef<DateInputRefType, DateInputProps>(
    (props: DateInputProps, ref: Ref<DateInputRefType>) => (
        <InnerDateInput innerRef={ref as RefObject<DateInputRefType>} {...props} />
    )
);
