// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "../../atoms/buttons/SimpleButton";

// icons
// TODO: Change this icon
import { StatusDoneIcon } from "../../atoms/icons/StatusDoneIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface BacklogItemDoneButtonStateProps extends PropsWithClassName {}

export interface BacklogItemDoneButtonDispatchProps {
    onClick: { () };
}

export type BacklogItemDoneButtonProps = BacklogItemDoneButtonStateProps & SimpleButtonProps & BacklogItemDoneButtonDispatchProps;

export const BacklogItemDoneButton: React.FC<BacklogItemDoneButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<StatusDoneIcon />} onClick={props.onClick}>
            Progress: Complete
        </SimpleButton>
    );
};
