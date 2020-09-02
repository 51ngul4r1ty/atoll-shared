// externals
import * as React from "react";

// icons
import { WindowsFrameCloseIcon } from "../../atoms/icons/WindowsFrameCloseIcon";

// style
import css from "./FrameCloseButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { buildClassName } from "../../../utils/classNameBuilder";

export interface FrameCloseButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface FrameCloseButtonDispatchProps {
    onClick: { () };
}

export type FrameCloseButtonProps = FrameCloseButtonStateProps & FrameCloseButtonDispatchProps;

export const FrameCloseButton: React.FC<FrameCloseButtonProps> = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const icon = <WindowsFrameCloseIcon invertColors={isHover} />;
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
