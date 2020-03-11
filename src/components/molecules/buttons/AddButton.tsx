// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonCommonProps } from "../../atoms/buttons/SimpleButton";

// icons
import { AddIcon } from "../../atoms/icons/AddIcon";

// style
import css from "./AddButton.module.css";

export interface AddButtonStateProps {
    itemName?: string;
}

export interface AddButtonDispatchProps {
    onClick: { () };
}

export type AddButtonProps = SimpleButtonCommonProps & AddButtonStateProps & AddButtonDispatchProps;

export const AddButton: React.FC<AddButtonProps> = (props) => {
    const icon = <AddIcon />;
    let text = "Add";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
