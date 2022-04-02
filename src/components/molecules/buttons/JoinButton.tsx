// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { TrashIcon } from "../../atoms/icons/TrashIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface JoinButtonStateProps extends PropsWithClassName {}

export interface JoinButtonDispatchProps {
    onClick: { () };
}

export type JoinButtonProps = JoinButtonStateProps & SimpleButtonProps & JoinButtonDispatchProps;

export const JoinButton: React.FC<JoinButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<TrashIcon />} onClick={props.onClick}>
            Join
        </SimpleButton>
    );
};
