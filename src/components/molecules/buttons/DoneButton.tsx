// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonCommonProps } from "../../atoms/buttons/SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// style
import css from "./DoneButton.module.css";

export interface DoneButtonStateProps {
    itemName?: string;
}

export interface DoneButtonDispatchProps {
    onClick: { () };
}

export type DoneButtonProps = SimpleButtonCommonProps & DoneButtonStateProps & DoneButtonDispatchProps;

export const DoneButton: React.FC<DoneButtonProps> = (props) => {
    const icon = <DoneIcon />;
    let text = "Done";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
