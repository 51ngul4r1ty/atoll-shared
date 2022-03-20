// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { StatusReleasedIcon } from "../../atoms/icons/StatusReleasedIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface BacklogItemReleasedButtonStateProps extends PropsWithClassName {}

export interface BacklogItemReleasedButtonDispatchProps {
    onClick: { () };
}

export type BacklogItemReleasedButtonProps = BacklogItemReleasedButtonStateProps &
    SimpleButtonProps &
    BacklogItemReleasedButtonDispatchProps;

export const BacklogItemReleasedButton: React.FC<BacklogItemReleasedButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<StatusReleasedIcon />} onClick={props.onClick} noWrap>
            Progress: Released
        </SimpleButton>
    );
};
