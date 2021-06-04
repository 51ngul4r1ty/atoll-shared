// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { StatusAcceptedIcon } from "../../atoms/icons/StatusAcceptedIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface BacklogItemAcceptedButtonStateProps extends PropsWithClassName {}

export interface BacklogItemAcceptedButtonDispatchProps {
    onClick: { () };
}

export type BacklogItemAcceptedButtonProps = BacklogItemAcceptedButtonStateProps &
    SimpleButtonProps &
    BacklogItemAcceptedButtonDispatchProps;

export const BacklogItemAcceptedButton: React.FC<BacklogItemAcceptedButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<StatusAcceptedIcon />} onClick={props.onClick} noWrap>
            Progress: Accepted
        </SimpleButton>
    );
};
