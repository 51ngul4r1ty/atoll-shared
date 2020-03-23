// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// style
import css from "./DoneButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface DoneButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface DoneButtonDispatchProps {
    onClick: { () };
}

export type DoneButtonProps = DoneButtonStateProps & DoneButtonDispatchProps;

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
