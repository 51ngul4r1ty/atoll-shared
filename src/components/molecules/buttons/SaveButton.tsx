// externals
import React, { forwardRef, RefObject, Ref } from "react";

// atoms
import { SimpleButton, SimpleButtonRefType } from "./SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

export type SaveButtonRefType = SimpleButtonRefType;

export type SaveButtonType = ComponentWithForwardedRef<SaveButtonProps>;

export interface SaveButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

interface SaveButtonInnerStateProps {
    innerRef: RefObject<SaveButtonRefType>;
}

export interface SaveButtonDispatchProps {
    onClick: { () };
}

export type SaveButtonProps = SaveButtonStateProps & SaveButtonDispatchProps;

const InnerSimpleButton: React.FC<SaveButtonProps & SaveButtonInnerStateProps> = (props) => {
    const icon = <DoneIcon />;
    let text = "Save";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton ref={props.innerRef} className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};

export const SaveButton: SaveButtonType = forwardRef((props: SaveButtonProps, ref: Ref<SaveButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<SaveButtonRefType>} {...props} />
));
