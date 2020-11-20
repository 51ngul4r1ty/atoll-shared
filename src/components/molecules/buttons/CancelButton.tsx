// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// icons
import { CancelIcon } from "../../atoms/icons/CancelIcon";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface CancelButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface CancelButtonDispatchProps {
    onClick: { () };
}

export type CancelButtonProps = CancelButtonStateProps & CancelButtonDispatchProps;

export const CancelButton: React.FC<CancelButtonProps> = (props) => {
    const icon = <CancelIcon />;
    let text = "Cancel";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};
