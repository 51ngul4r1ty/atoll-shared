// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// style
import css from "./AddButton.module.css";
import { AddIcon } from "../../atoms/icons/AddIcon";

export interface AddButtonStateProps {
    itemName?: string;
}

export interface AddButtonDispatchProps {
    onClick: { () };
}

export type AddButtonProps = AddButtonStateProps & AddButtonDispatchProps;

export const AddButton: React.FC<AddButtonProps> = (props) => {
    const icon = <AddIcon />;
    let text = "Add";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
