// externals
import React, {
    forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    PropsWithChildren,
    RefAttributes,
    RefObject,
    Ref
} from "react";

// atoms
import { SimpleButton, SimpleButtonRefType } from "../../atoms/buttons/SimpleButton";

// icons
import { DoneIcon } from "../../atoms/icons/DoneIcon";

// style
import css from "./DoneButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface DoneButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

interface DoneButtonInnerStateProps {
    innerRef: RefObject<DoneButtonRefType>; // TODO: Define type
}

export interface DoneButtonDispatchProps {
    onClick: { () };
}

export type DoneButtonProps = DoneButtonStateProps & DoneButtonDispatchProps;

export const RawDoneButton: React.FC<DoneButtonProps & DoneButtonInnerStateProps> = (props) => {
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

export type DoneButtonRefType = SimpleButtonRefType;

export type DoneButtonType = ForwardRefExoticComponent<PropsWithoutRef<PropsWithChildren<DoneButtonProps>> & RefAttributes<any>>;

export const DoneButton: DoneButtonType = forwardRef((props: DoneButtonProps, ref: Ref<DoneButtonRefType>) => (
    <RawDoneButton innerRef={ref as RefObject<DoneButtonRefType>} {...props} />
));
