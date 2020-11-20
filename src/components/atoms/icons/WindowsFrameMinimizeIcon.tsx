// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface WindowsFrameMinimizeIconDispatchProps {
    onMouseEnter?: { () };
    onMouseLeave?: { () };
}

export interface WindowsFrameMinimizeIconProps extends StandardInvertibleComponentProps, WindowsFrameMinimizeIconDispatchProps {}

export const WindowsFrameMinimizeIcon: React.FC<WindowsFrameMinimizeIconProps> = (props) => {
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
                    <rect
                        className={fillClass}
                        x="0.003"
                        y="29.998"
                        width="74.985"
                        height="7.495"
                        strokeLinejoin="miter"
                        stroke="none"
                        fill="black"
                    />
                </g>
            </svg>
        </>
    );
};
