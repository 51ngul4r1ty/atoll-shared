// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "../../atoms/buttons/SimpleButton";

// icons
// TODO: Change this icon
import { TrashIcon } from "../../atoms/icons/TrashIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface MoveToBacklogButtonStateProps extends PropsWithClassName {}

export interface MoveToBacklogButtonDispatchProps {
    onClick: { () };
}

export type MoveToBacklogButtonProps = MoveToBacklogButtonStateProps & SimpleButtonProps & MoveToBacklogButtonDispatchProps;

export const MoveToBacklogButton: React.FC<MoveToBacklogButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<TrashIcon />} onClick={props.onClick}>
            Move to Backlog
        </SimpleButton>
    );
};
