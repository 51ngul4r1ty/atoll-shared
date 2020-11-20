// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { ElementAttribute, StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface CheckboxUncheckedIconProps extends StandardInvertibleComponentProps {
    includedSvgAttributes?: ElementAttribute<any>[];
}

export const CheckboxUncheckedIcon: React.FC<CheckboxUncheckedIconProps> = (props) => {
    const { fillClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    const addedSvgProps = {};
    if (props.includedSvgAttributes) {
        props.includedSvgAttributes.forEach((svgAttribute) => {
            addedSvgProps[svgAttribute.name] = svgAttribute.value;
        });
    }

    return (
        <svg
            {...addedSvgProps}
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
            width="37.5pt"
            height="37.5pt"
            viewBox="0 -37.5 37.5 37.5"
        >
            <defs />
            <g id="Layer 1" transform="scale(1 -1)">
                <path
                    d="M 2.25,6.913 L 2.25,30.583 C 2.25,33.159 4.339,35.25 6.914,35.25 L 30.584,35.25 C 33.16,35.25 35.251,33.159 35.251,30.583 L 35.251,6.913 C 35.251,4.338 33.16,2.249 30.584,2.249 L 6.914,2.249 C 4.339,2.249 2.25,4.338 2.25,6.913 Z M 32.339,9.002 L 32.339,28.494 C 32.339,30.614 30.615,32.338 28.495,32.338 L 9.003,32.338 C 6.883,32.338 5.162,30.614 5.162,28.494 L 5.162,9.002 C 5.162,6.882 6.883,5.161 9.003,5.161 L 28.495,5.161 C 30.615,5.161 32.339,6.882 32.339,9.002 Z"
                    className={fillClass}
                    fill="#0d2644"
                    stroke="none"
                    strokeLinejoin="miter"
                    strokeWidth="1.004"
                    strokeLinecap="round"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    );
};
