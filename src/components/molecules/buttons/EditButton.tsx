// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// style
import css from "./EditButton.module.css";
import { EditIcon } from "../../atoms/icons/EditIcon";
import { EditCancelIcon } from "../../atoms/icons/EditCancelIcon";

export enum EditMode {
    VIEW,
    EDIT
}

export interface EditButtonAttributeProps {
    mode: EditMode;
}

export interface EditButtonEventProps {
    onClick: { () };
}

export type EditButtonProps = EditButtonAttributeProps & EditButtonEventProps;

export const EditButton: React.FC<EditButtonProps> = (props) => {
    const icon = props.mode === EditMode.VIEW ? <EditIcon /> : <EditCancelIcon />;
    const text = props.mode === EditMode.VIEW ? "Edit" : "View";
    return (
        <SimpleButton iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
