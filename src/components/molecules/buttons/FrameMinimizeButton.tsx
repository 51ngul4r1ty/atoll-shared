// externals
import * as React from "react";

// icons
import { WindowsFrameMinimizeIcon } from "../../atoms/icons/WindowsFrameMinimizeIcon";

// style
import css from "./FrameMinimizeButton.module.css";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { buildClassName } from "../../../utils/classNameBuilder";

export interface FrameMinimizeButtonStateProps extends PropsWithClassName {
    itemName?: string;
}

export interface FrameMinimizeButtonDispatchProps {
    onClick: { () };
}

export type FrameMinimizeButtonProps = FrameMinimizeButtonStateProps & FrameMinimizeButtonDispatchProps;

export const FrameMinimizeButton: React.FC<FrameMinimizeButtonProps> = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const icon = <WindowsFrameMinimizeIcon invertColors={isHover} />;
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
