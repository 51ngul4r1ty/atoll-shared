// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface WindowsFrameRestoreIconDispatchProps {
    onMouseEnter?: { () };
    onMouseLeave?: { () };
}

export interface WindowsFrameRestoreIconProps extends StandardInvertibleComponentProps, WindowsFrameRestoreIconDispatchProps {}

export const WindowsFrameRestoreIcon: React.FC<WindowsFrameRestoreIconProps> = (props) => {
    const { fillClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    return (
        <>
            <svg
                className={props.className}
                fill="none"
                fillRule="evenodd"
                stroke="black"
                strokeWidth="0.501"
                strokeLinejoin="bevel"
                strokeMiterlimit="10"
                fontFamily="Times New Roman"
                fontSize="16"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                overflow="visible"
                width="75pt"
                height="75pt"
                viewBox="0 -75 75 75"
            >
                <defs></defs>
                <g id="Layer 1" transform="scale(1 -1)">
                    <path
                        className={fillClass}
                        d="M 0,0 L 0,59.248 L 15.002,59.248 L 15.002,75 L 75,75 L 75,15.752 L 59.248,15.752 L 59.248,0 L 0,0 Z M 51.748,7.49 L 51.748,51.748 L 7.49,51.748 L 7.49,7.49 L 51.748,7.49 Z M 67.5,23.242 L 67.5,67.5 L 22.493,67.5 L 22.493,59.248 L 59.248,59.248 L 59.248,23.242 L 67.5,23.242 Z"
                        fill="black"
                        strokeLinejoin="miter"
                        stroke="none"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </svg>
        </>
    );
};
