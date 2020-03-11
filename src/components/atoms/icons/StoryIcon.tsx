// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type StoryIconProps = StandardInvertibleComponentProps;

export const StoryIcon: React.FC<StoryIconProps> = (props) => {
    const { fillClass, strokeClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    return (
        <>
            <svg
                fill="none"
                fillRule="evenodd"
                className={strokeClass}
                stroke="black"
                strokeWidth="0.501"
                strokeLinejoin="bevel"
                strokeMiterlimit="10"
                fontFamily="Times New Roman"
                fontSize="16"
                style={{ fontVariantLigatures: "none" }}
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                overflow="visible"
                width="450pt"
                height="450pt"
                viewBox="0 -450 450 450"
            >
                <defs />
                <g id="Layer 1" transform="scale(1 -1)">
                    <path
                        d="M 114.498,31.75 L 4.417,224.441 L 183.626,189.721 L 225.808,31.75 L 114.498,31.75 Z M 226.322,31.75 L 265.416,190.387 L 444.695,228.024 L 264.675,262.903 L 222.599,420.54 L 336.672,420.54 L 447.75,226.136 L 336.654,31.75 L 226.322,31.75 Z M 4.25,224.734 L 3.439,226.154 L 114.517,420.54 L 221.915,420.54 L 182.885,262.236 L 4.25,224.734 Z"
                        className={fillClass}
                        fill="#000000"
                        strokeLinecap="round"
                        strokeWidth="11.108"
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
