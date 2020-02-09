// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// style
import css from "./EditButton.module.css";
import { EditIcon } from "../../atoms/icons/EditIcon";
import { EditCancelIcon } from "../../atoms/icons/EditCancelIcon";

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

export type EditButtonProps = EditButtonStateProps & EditButtonDispatchProps;

export const EditButton: React.FC<EditButtonProps> = (props) => {
    const icon = props.mode === EditMode.View ? <EditIcon /> : <EditCancelIcon />;
    const text = props.mode === EditMode.View ? "Edit" : "View";
    return (
        <SimpleButton iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
