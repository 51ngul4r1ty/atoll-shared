// externals
import React, { forwardRef, RefObject, Ref } from "react";

// atoms
import { SimpleButton, SimpleButtonRefType } from "../../atoms/buttons/SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// style
import css from "./DoneButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { ComponentWithForwardedRef } from "../../../types";

export type DoneButtonRefType = SimpleButtonRefType;

export type DoneButtonType = ComponentWithForwardedRef<DoneButtonProps>;

export interface DoneButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

interface DoneButtonInnerStateProps {
    innerRef: RefObject<DoneButtonRefType>;
}

export interface DoneButtonDispatchProps {
    onClick: { () };
}

export type DoneButtonProps = DoneButtonStateProps & DoneButtonDispatchProps;

const InnerSimpleButton: React.FC<DoneButtonProps & DoneButtonInnerStateProps> = (props) => {
    const icon = <DoneIcon />;
    let text = "Done";
    if (props.itemName) {
        text += ` ${props.itemName}`;
    }
    return (
        <SimpleButton ref={props.innerRef} className={props.className} iconOnLeft icon={icon} onClick={props.onClick}>
            {text}
        </SimpleButton>
    );
};

export const DoneButton: DoneButtonType = forwardRef((props: DoneButtonProps, ref: Ref<DoneButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<DoneButtonRefType>} {...props} />
));
