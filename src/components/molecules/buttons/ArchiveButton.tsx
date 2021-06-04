// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { ArchiveIcon } from "../../atoms/icons/ArchiveIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface ArchiveButtonStateProps extends PropsWithClassName {}

export interface ArchiveButtonDispatchProps {
    onClick: { () };
}

export type ArchiveButtonProps = ArchiveButtonStateProps & SimpleButtonProps & ArchiveButtonDispatchProps;

export const ArchiveButton: React.FC<ArchiveButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<ArchiveIcon />} onClick={props.onClick}>
            Archive
        </SimpleButton>
    );
};
