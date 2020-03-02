// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonCommonProps } from "../../atoms/buttons/SimpleButton";

// icons
import { EditIcon } from "../../atoms/icons/EditIcon";
import { EditCancelIcon } from "../../atoms/icons/EditCancelIcon";

// style
import css from "./EditButton.module.css";

export enum EditMode {
    View,
    Edit
}

export interface EditButtonStateProps {
    mode: EditMode;
}

export interface EditButtonDispatchProps {
    onClick: { () };
}

export type EditButtonProps = SimpleButtonCommonProps & EditButtonStateProps & EditButtonDispatchProps;

export const EditButton: React.FC<EditButtonProps> = (props) => {
    const icon = props.mode === EditMode.View ? <EditIcon /> : <EditCancelIcon />;
    const text = props.mode === EditMode.View ? "Edit" : "View";
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
