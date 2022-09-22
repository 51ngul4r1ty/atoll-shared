// externals
import React, { forwardRef, ChangeEvent, FocusEvent, RefObject, Ref, useState, useEffect } from "react";
import ReactDOM from "react-dom";

// style
import css from "./DateInput.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { usePrevious } from "../../../common/usePreviousHook";
import { ItemMenuPanel, ItemMenuPanelCaretPosition, ItemMenuPanelColor } from "../../panels/ItemMenuPanel";
import { hasParentWithDataClass } from "../../../common/domUtils";

// interfaces/types
import type { DatePickerBuilder } from "./dateInputTypes";
import type { ComponentWithForwardedRef } from "../../../../types/reactHelperTypes";
import { DateOnly } from "../../../../types/dateTypes";

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
    inputId: string;
    inputName?: string;
    inputValue: DateOnly | null;
    itemType?: string;
    labelText: string;
    modalPanelEltId?: string;
    pickerMode?: DateInputPickerMode;
    placeHolder?: string;
    rangeAltValue?: DateOnly | null;
    readOnly?: boolean;
    required?: boolean;
    showPicker?: boolean;
    size?: number;
    type?: string;
    validator?: { (value: string): boolean };
    buildDatePicker: DatePickerBuilder;
}

export interface DateInputDispatchProps {
    onChange?: { (value: string): void };
    onInputFocus?: { (e: FocusEvent<HTMLDivElement>): void };
    onInputFocusLost?: { (e: FocusEvent<HTMLDivElement>, notLostToDatePicker: boolean): void };
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

export const getModalPanelElt = (modalPanelId: string = "atollModalPanel") => document.getElementById(modalPanelId);

export const buildModalComponentDivClassName = (relatedComponentId: string) => `ATOLL-TAG-MODAL-${relatedComponentId}`;

/**
 *
 * @param relatedComponentId
 * @param relatedComponentDescrip Something like "DateInput's props.inputId"
 * @param modalComponentElt
 */
export const registerModalComponent = (
    relatedComponentId: string,
    relatedComponentDescrip: string,
    modalPanelEltId: string,
    modalComponentElt: JSX.Element
) => {
    const scrollOffsetY = window.scrollY;
    const scrollOffsetX = window.scrollX;
    const relatedComponent = document.getElementById(relatedComponentId);
    if (!relatedComponent) {
        throw new Error(`${relatedComponentDescrip} must reference an existing component - unable to find one!`);
    }
    const boundingRect = relatedComponent.getBoundingClientRect();
    const modalElt = getModalPanelElt(modalPanelEltId);
    if (!modalElt) {
        throw new Error(`Unable to get the modal panel element by name provided: "${modalPanelEltId}"`);
    }
    const tagNameKey = buildModalComponentDivClassName(relatedComponentId);
    const elts = modalElt.getElementsByClassName(tagNameKey);
    let parentElt: Element;
    if (!elts.length) {
        const divNode = document.createElement("div");
        divNode.className = tagNameKey;
        modalElt.appendChild(divNode);
        parentElt = divNode;
    } else {
        parentElt = elts[0];
    }
    const parentEltAsDiv = parentElt as HTMLDivElement;
    parentEltAsDiv.style.position = "absolute";
    parentEltAsDiv.style.top = `${boundingRect.top + scrollOffsetY}px`;
    parentEltAsDiv.style.left = `${boundingRect.left + scrollOffsetX}px`;
    parentEltAsDiv.style.width = `${boundingRect.width}px`;
    parentEltAsDiv.style.height = "0";
    parentEltAsDiv.style.overflow = "visible";
    ReactDOM.render(modalComponentElt, parentElt);
};

export const unregisterModalComponent = (relatedComponentId: string, modalPanelEltId?: string) => {
    const modalElt = getModalPanelElt(modalPanelEltId);
    if (!modalElt) {
        throw new Error(`Unable to get the modal panel element by name provided: "${modalPanelEltId}"`);
    }
    const tagNameKey = buildModalComponentDivClassName(relatedComponentId);
    const elts = modalElt.getElementsByClassName(tagNameKey);
    if (elts.length) {
        modalElt.removeChild(elts[0]);
    }
};

export const InnerDateInput: React.FC<DateInputProps & DateInputInnerStateProps> = (props) => {
    const inputTextStartingEmptyValue = props.readOnly ? "-" : "";
    const propsInputValueToUse = props.inputValue ? props.inputValue.formatAsText() : inputTextStartingEmptyValue;
    const [inputText, setInputText] = useState(propsInputValueToUse);
    const [validInputText, setValidInputText] = useState(props.inputValue ? props.inputValue.formatAsText() : "");
    const [isValid, setIsValid] = useState(true); // start off "valid", even if starting value is invalid
    const propagateTextChange = (inputText: string, lastValidInputText?: string): void => {
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
    };
    const handleInputFocusLost = (e: FocusEvent<HTMLDivElement>) => {
        const eltReceivingFocus = e.relatedTarget as HTMLElement;
        const temp = e.currentTarget as HTMLElement;
        const notLostToDatePicker = !hasParentWithDataClass(eltReceivingFocus, "date-picker");
        if (props.onInputFocusLost) {
            props.onInputFocusLost(e, notLostToDatePicker);
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
    const pickingStartDate = props.pickerMode === DateInputPickerMode.RangeAltIsFinishDate;
    const startDateToUse = props.pickerMode === DateInputPickerMode.RangeAltIsStartDate ? props.rangeAltValue : props.inputValue;
    const finishDateToUse = props.pickerMode === DateInputPickerMode.RangeAltIsFinishDate ? props.rangeAltValue : props.inputValue;
    useEffect(() => {
        const relatedComponentId = props.inputId;
        const propDescrip = "props.inputId";
        if (!relatedComponentId) {
            throw new Error(`${propDescrip} is required for DateInput!`);
        }
        registerModalComponent(
            relatedComponentId,
            `DateInput's ${propDescrip}`,
            props.modalPanelEltId,
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
                    {props.buildDatePicker(startDateToUse, finishDateToUse, pickingStartDate, (date: DateOnly) =>
                        propagateTextChange(date.formatAsText())
                    )}
                </ItemMenuPanel>
            </div>
        );
        return function cleanup() {
            unregisterModalComponent(relatedComponentId, props.modalPanelEltId);
        };
    }, [showPicker, props.showPicker, startDateToUse, finishDateToUse, pickingStartDate]);
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
        </div>
    );
};

export const DateInput: DateInputType = forwardRef<DateInputRefType, DateInputProps>(
    (props: DateInputProps, ref: Ref<DateInputRefType>) => (
        <InnerDateInput innerRef={ref as RefObject<DateInputRefType>} {...props} />
    )
);
