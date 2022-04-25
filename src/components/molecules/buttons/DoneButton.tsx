// externals
import React, { forwardRef, RefObject, Ref } from "react";

// atoms
import { SimpleButton, SimpleButtonRefType } from "./SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

export type DoneButtonRefType = SimpleButtonRefType;

export type DoneButtonType = ComponentWithForwardedRef<DoneButtonProps>;

export interface DoneButtonStateProps extends PropsWithClassName {
    busy?: boolean;
    itemName?: string;
    disabled?: boolean;
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
        <SimpleButton
            ref={props.innerRef}
            busy={props.busy}
            className={props.className}
            iconOnLeft
            icon={icon}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {text}
        </SimpleButton>
    );
};

export const DoneButton: DoneButtonType = forwardRef((props: DoneButtonProps, ref: Ref<DoneButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<DoneButtonRefType>} {...props} />
));
