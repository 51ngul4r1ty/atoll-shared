// externals
import * as React from "react";

// atoms
import { SimpleButton } from "./SimpleButton";

// icons
import { CancelIcon } from "../../atoms/icons/CancelIcon";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface ResetButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface ResetButtonDispatchProps {
    onClick: { () };
}

export type ResetButtonProps = ResetButtonStateProps & ResetButtonDispatchProps;

export const ResetButton: React.FC<ResetButtonProps> = (props) => {
    const icon = <CancelIcon />;
    let text = "Reset";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
