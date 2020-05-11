// externals
import * as React from "react";

// atoms
import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// icons
import { TrashIcon } from "../../atoms/icons/TrashIcon";

// style
import css from "./RemoveButton.module.css";
import { PropsWithClassName } from "../../common/types";

export interface RemoveButtonStateProps extends PropsWithClassName {}

export interface RemoveButtonDispatchProps {
    onClick: { () };
}

export type RemoveButtonProps = RemoveButtonStateProps & RemoveButtonDispatchProps;

export const RemoveButton: React.FC<RemoveButtonProps> = (props) => {
    return (
        <SimpleButton className={props.className} iconOnLeft icon={<TrashIcon />} onClick={props.onClick}>
            Remove
        </SimpleButton>
    );
};
