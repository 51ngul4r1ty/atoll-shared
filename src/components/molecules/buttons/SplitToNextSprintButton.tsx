// externals
import * as React from "react";

// atoms
import { SimpleButton, SimpleButtonProps, cleanPassthroughProps } from "./SimpleButton";

// icons
import { SplitButtonIcon } from "../../atoms/icons/SplitButtonIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface SplitToNextSprintButtonStateProps extends PropsWithClassName {
    busy: boolean;
}

export interface SplitToNextSprintButtonDispatchProps {
    onClick: { () };
}

export type SplitToNextSprintButtonProps = SplitToNextSprintButtonStateProps &
    SimpleButtonProps &
    SplitToNextSprintButtonDispatchProps;

export const SplitToNextSprintButton: React.FC<SplitToNextSprintButtonProps> = (props) => {
    return (
        <SimpleButton {...cleanPassthroughProps(props)} iconOnLeft icon={<SplitButtonIcon />} onClick={props.onClick} noWrap>
            Split to Next Sprint
        </SimpleButton>
    );
};
