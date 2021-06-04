// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { StatusInProgressIcon } from "../../atoms/icons/StatusInProgressIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface BacklogItemInProgressButtonStateProps extends PropsWithClassName {}

export interface BacklogItemInProgressButtonDispatchProps {
    onClick: { () };
}

export type BacklogItemInProgressButtonProps = BacklogItemInProgressButtonStateProps &
    SimpleButtonProps &
    BacklogItemInProgressButtonDispatchProps;

export const BacklogItemInProgressButton: React.FC<BacklogItemInProgressButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<StatusInProgressIcon />} onClick={props.onClick} noWrap>
            Progress: Busy
        </SimpleButton>
    );
};
