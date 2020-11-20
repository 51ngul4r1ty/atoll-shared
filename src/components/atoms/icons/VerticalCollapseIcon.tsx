// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type VerticalCollapseIconProps = StandardInvertibleComponentProps;

export const VerticalCollapseIcon: React.FC<VerticalCollapseIconProps> = (props) => {
    const { fillClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    return (
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
            <defs />
            <g id="Layer 1" transform="scale(1 -1)">
                <path
                    d="M 37.485,54 L 17.25,21 C 26.638,23.382 37.336,24.201 48.165,23.008 C 51.785,22.606 55.233,22.001 58.5,21.214 L 37.485,54 Z"
                    className={fillClass}
                    fill="#0d2644"
                    strokeLinejoin="miter"
                    stroke="none"
                    strokeLinecap="round"
                    strokeWidth="0.261"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    );
};
