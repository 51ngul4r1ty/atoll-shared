// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonCommonProps } from "../../atoms/buttons/SimpleButton";

// icons
import { CancelIcon } from "../../atoms/icons/CancelIcon";

// style
import css from "./CancelButton.module.css";

export interface CancelButtonStateProps {
    itemName?: string;
}

export interface CancelButtonDispatchProps {
    onClick: { () };
}

export type CancelButtonProps = SimpleButtonCommonProps & CancelButtonStateProps & CancelButtonDispatchProps;

export const CancelButton: React.FC<CancelButtonProps> = (props) => {
    const icon = <CancelIcon />;
    let text = "Cancel";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
