// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { TrashIcon } from "../../atoms/icons/TrashIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface RemoveButtonStateProps extends PropsWithClassName {}

export interface RemoveButtonDispatchProps {
    onClick: { () };
}

export type RemoveButtonProps = RemoveButtonStateProps & SimpleButtonProps & RemoveButtonDispatchProps;

export const RemoveButton: React.FC<RemoveButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<TrashIcon />} onClick={props.onClick}>
            Remove
        </SimpleButton>
    );
};
