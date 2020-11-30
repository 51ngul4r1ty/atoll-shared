// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "../../atoms/buttons/SimpleButton";

// icons
import { StatusNotStartedIcon } from "../../atoms/icons/StatusNotStartedIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface BacklogItemNotStartedButtonStateProps extends PropsWithClassName {}

export interface BacklogItemNotStartedButtonDispatchProps {
    onClick: { () };
}

export type BacklogItemNotStartedButtonProps = BacklogItemNotStartedButtonStateProps &
    SimpleButtonProps &
    BacklogItemNotStartedButtonDispatchProps;

export const BacklogItemNotStartedButton: React.FC<BacklogItemNotStartedButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<StatusNotStartedIcon />} onClick={props.onClick}>
            Progress: Todo
        </SimpleButton>
    );
};
