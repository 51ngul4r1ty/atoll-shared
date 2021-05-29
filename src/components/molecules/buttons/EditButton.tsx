// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { EditIcon } from "../../atoms/icons/EditIcon";
import { EditCancelIcon } from "../../atoms/icons/EditCancelIcon";

// style
import { PropsWithClassName } from "../../common/types";

// consts/enums
import { EditMode } from "../../common/componentEnums";

export interface EditButtonStateProps extends PropsWithClassName {
    mode: EditMode;
}

export interface EditButtonDispatchProps {
    onClick: { () };
}

export type EditButtonProps = EditButtonStateProps & SimpleButtonProps & EditButtonDispatchProps;

export const EditButton: React.FC<EditButtonProps> = (props) => {
    const icon = props.mode === EditMode.View ? <EditIcon /> : <EditCancelIcon />;
    const text = props.mode === EditMode.View ? "Edit" : "View";
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
