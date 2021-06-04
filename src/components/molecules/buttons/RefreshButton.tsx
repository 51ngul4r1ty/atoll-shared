// externals
import * as React from "react";

// atoms
import { SimpleButton } from "./SimpleButton";

// icons
import { RefreshIcon } from "../../atoms/icons/RefreshIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface RefreshButtonStateProps extends PropsWithClassName {}

export interface RefreshButtonDispatchProps {
    onClick: { () };
}

export type RefreshButtonProps = RefreshButtonStateProps & RefreshButtonDispatchProps;

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
    return (
        <SimpleButton className={props.className} iconOnLeft icon={<RefreshIcon />} onClick={props.onClick}>
            Refresh
        </SimpleButton>
    );
};
