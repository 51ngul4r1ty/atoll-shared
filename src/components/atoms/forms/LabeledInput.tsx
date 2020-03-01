// externals
import React, { FC } from "react";

// style
import css from "./LabeledInput.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export interface LabeledInputProps {
    className?: string;
    labelText: string;
    inputId: string;
    inputName?: string;
    placeHolder?: string;
    size?: number;
}

export const LabeledInput: FC<LabeledInputProps> = (props) => {
    const nameToUse = props.inputName || props.inputId;
    const classToUse = buildClassName(css.input, props.className);
    return (
        <div className={classToUse}>
            <input id={props.inputId} name={nameToUse} type="text" placeholder={props.placeHolder} size={props.size}></input>
            <label htmlFor={props.inputName}>{props.labelText}</label>
        </div>
    );
};
