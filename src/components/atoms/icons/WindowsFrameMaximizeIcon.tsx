// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface WindowsFrameMaximizeIconDispatchProps {
    onMouseEnter?: { () };
    onMouseLeave?: { () };
}

export interface WindowsFrameMaximizeIconProps extends StandardInvertibleComponentProps, WindowsFrameMaximizeIconDispatchProps {}

export const WindowsFrameMaximizeIcon: React.FC<WindowsFrameMaximizeIconProps> = (props) => {
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
                        d="M 0.01,0 L 0.01,74.99 L 74.99,74.99 L 74.99,0 L 0.01,0 Z M 67.491,7.49 L 67.491,67.49 L 7.499,67.49 L 7.499,7.49 L 67.491,7.49 Z"
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
