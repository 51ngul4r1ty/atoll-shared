// externals
import * as React from "react";

// icons
import { WindowsFrameMaximizeIcon } from "../../atoms/icons/WindowsFrameMaximizeIcon";
import { WindowsFrameRestoreIcon } from "../../atoms/icons/WindowsFrameRestoreIcon";

// style
import css from "./FrameMaximizeButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { buildClassName } from "../../../utils/classNameBuilder";

export interface FrameMaximizeButtonStateProps extends PropsWithClassName {
    itemName?: string;
    isMaximized?: boolean;
}

export enum MaximizedState {
    NotMaximized = 0,
    Maximized = 1
}

export interface FrameMaximizeButtonDispatchProps {
    onClick: { () };
}

export type FrameMaximizeButtonProps = FrameMaximizeButtonStateProps & FrameMaximizeButtonDispatchProps;

export const FrameMaximizeButton: React.FC<FrameMaximizeButtonProps> = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const icon = props.isMaximized ? (
        <WindowsFrameRestoreIcon invertColors={isHover} />
    ) : (
        <WindowsFrameMaximizeIcon invertColors={isHover} />
    );
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
