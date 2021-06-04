// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { ArchiveCancelIcon } from "../../atoms/icons/ArchiveCancelIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface ArchiveCancelButtonStateProps extends PropsWithClassName {}

export interface ArchiveCancelButtonDispatchProps {
    onClick: { () };
}

export type ArchiveCancelButtonProps = ArchiveCancelButtonStateProps & SimpleButtonProps & ArchiveCancelButtonDispatchProps;

export const ArchiveCancelButton: React.FC<ArchiveCancelButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<ArchiveCancelIcon />} onClick={props.onClick}>
            Un-archive
        </SimpleButton>
    );
};
