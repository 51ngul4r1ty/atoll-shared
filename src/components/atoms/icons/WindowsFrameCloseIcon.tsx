// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface WindowsFrameCloseIconDispatchProps {
    onMouseEnter?: { () };
    onMouseLeave?: { () };
}

export interface WindowsFrameCloseIconProps extends StandardInvertibleComponentProps, WindowsFrameCloseIconDispatchProps {}

export const WindowsFrameCloseIcon: React.FC<WindowsFrameCloseIconProps> = (props) => {
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
                        d="M 0,4.94 L 32.566,37.51 L 0.01,70.07 L 4.939,75 L 37.495,42.43 L 70.061,75 L 74.99,70.08 L 42.424,37.51 L 74.99,4.93 L 70.071,0 L 37.495,32.58 L 4.929,0.01 L 0,4.94 Z"
                        strokeLinejoin="miter"
                        stroke="none"
                        fill="black"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </svg>
        </>
    );
};
