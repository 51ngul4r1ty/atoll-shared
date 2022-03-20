// externals
import * as React from "react";

// atoms
import { SimpleButton } from "./SimpleButton";

// icons
import { AddIcon } from "../../atoms/icons/AddIcon";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface AddButtonStateProps extends PropsWithClassName {
    itemName?: string;
    suppressSpacing?: boolean;
    disabled?: boolean;
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
        <SimpleButton
            className={props.className}
            iconOnLeft
            icon={icon}
            disabled={props.disabled}
            suppressSpacing={props.suppressSpacing}
            onClick={props.onClick}
        >
            {text}
        </SimpleButton>
    );
};
