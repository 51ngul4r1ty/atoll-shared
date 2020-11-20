// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { ElementAttribute, StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export interface CheckboxCheckedIconProps extends StandardInvertibleComponentProps {
    includedSvgAttributes?: ElementAttribute<any>[];
}

export const CheckboxCheckedIcon: React.FC<CheckboxCheckedIconProps> = (props) => {
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
                    d="M 2.249,6.915 L 2.249,30.583 C 2.249,33.158 4.34,35.249 6.915,35.249 L 30.583,35.249 C 33.158,35.249 35.249,33.158 35.249,30.583 L 35.249,6.915 C 35.249,4.34 33.158,2.249 30.583,2.249 L 6.915,2.249 C 4.34,2.249 2.249,4.34 2.249,6.915 Z M 15.851,9.665 L 29.949,23.678 L 25.901,27.698 L 15.851,17.704 L 11.746,21.791 L 7.701,17.774 L 15.851,9.665 Z"
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
