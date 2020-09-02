// externals
import * as React from "react";

// // atoms
// import { SimpleButton } from "../../atoms/buttons/SimpleButton";

// icons
import { WindowsFrameMaximizeIcon } from "../../atoms/icons/WindowsFrameMaximizeIcon";

// style
import css from "./FrameMaximizeButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { buildClassName } from "../../../utils/classNameBuilder";

export interface FrameMaximizeButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface FrameMaximizeButtonDispatchProps {
    onClick: { () };
}

export type FrameMaximizeButtonProps = FrameMaximizeButtonStateProps & FrameMaximizeButtonDispatchProps;

export const FrameMaximizeButton: React.FC<FrameMaximizeButtonProps> = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const icon = <WindowsFrameMaximizeIcon invertColors={isHover} />;
    const className = buildClassName(props.className, css.frameCloseButton, isHover ? css.hover : null);
    return (
        <div
            className={className}
            onMouseEnter={() => {
                setIsHover(true);
            }}
            onMouseLeave={() => {
                setIsHover(false);
            }}
            onClick={() => {
                if (props.onClick) {
                    props.onClick();
                }
            }}
        >
            {icon}
        </div>
    );
};
