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
    isMaximizedToStart?: boolean;
}

export enum MaximizedState {
    NotMaximized = 0,
    Maximized = 1
}

export interface FrameMaximizeButtonDispatchProps {
    /**
     * Handle the maximize/restore functionality.
     *
     * @returns true, false or undefined;
     *   true = window state changed after click;
     *   false = it didn't change;
     *   undefined probably means that the developer was unaware that returning a value would have an effect - so we assume the
     *       window state change was successful.
     */
    onClick: { (currentState: MaximizedState): boolean | void };
}

export type FrameMaximizeButtonProps = FrameMaximizeButtonStateProps & FrameMaximizeButtonDispatchProps;

export const FrameMaximizeButton: React.FC<FrameMaximizeButtonProps> = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(props.isMaximizedToStart);
    const icon = isMaximized ? (
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
                    const currentState = isMaximized ? MaximizedState.Maximized : MaximizedState.NotMaximized;
                    const clickResult = props.onClick(currentState);
                    if (clickResult !== false) {
                        setIsMaximized(!isMaximized);
                    }
                }
            }}
        >
            {icon}
        </div>
    );
};
