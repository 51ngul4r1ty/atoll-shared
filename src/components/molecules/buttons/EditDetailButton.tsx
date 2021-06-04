// externals
import * as React from "react";

// atoms
import { SimpleButton } from "./SimpleButton";

// icons
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";

// style
import { PropsWithClassName } from "../../common/types";

export interface EditDetailButtonStateProps extends PropsWithClassName {
    isOpen: boolean;
}

export interface EditDetailButtonDispatchProps {
    onClick: { (opening: boolean) };
}

export type EditDetailButtonProps = EditDetailButtonStateProps & EditDetailButtonDispatchProps;

export const EditDetailButton: React.FC<EditDetailButtonProps> = (props) => {
    const icon = <EditDetailIcon />;
    return (
        <SimpleButton
            className={props.className}
            icon={icon}
            onClick={() => {
                props.onClick(!props.isOpen);
            }}
        />
    );
};
