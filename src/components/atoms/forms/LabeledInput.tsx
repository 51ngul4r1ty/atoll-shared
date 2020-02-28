// externals
import React, { FC } from "react";

// style
import css from "./LabeledInput.module.css";

export interface LabeledInputProps {
    labelText: string;
    inputId: string;
    inputName?: string;
    placeHolder?: string;
    size?: number;
}

export const LabeledInput: FC<LabeledInputProps> = (props) => {
    const nameToUse = props.inputName || props.inputId;
    return (
        <div className={css.input}>
            <input id={props.inputId} name={nameToUse} type="text" placeholder={props.placeHolder} size={props.size}></input>
            <label htmlFor={props.inputName}>{props.labelText}</label>
        </div>
    );
};
