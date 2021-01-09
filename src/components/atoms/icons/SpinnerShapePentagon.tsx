// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type SpinnerShapePentagonProps = StandardInvertibleComponentProps;

export const SpinnerShapePentagon: React.FC<SpinnerShapePentagonProps> = (props) => {
    const { fillClass, strokeClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    const classNameToUse = buildClassName(strokeClass, props.className);

    return (
        <svg
            fill="none"
            className={classNameToUse}
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
            width="450pt"
            height="450pt"
            viewBox="0 -450 450 450"
        >
            <defs>
            </defs>
            <g
                id="Layer 1"
                transform="scale(1 -1)"
            >
                <path
                    d="M 224.536,62.317 C 181.503,62.549 137.869,56.729 93.659,45.194 C 91.044,90.72 83.121,133.915 69.571,174.656 C 56.434,215.595 37.291,255.222 12.449,293.629 C 55.014,310.138 93.733,330.926 128.39,356.262 C 163.325,381.222 195.173,411.427 224.115,446.584 C 253.007,411.527 284.783,381.409 319.639,356.51 C 354.667,330.912 393.845,309.943 436.946,293.343 C 412.088,254.92 392.925,215.273 379.794,174.316 C 366.266,133.65 358.343,90.542 355.721,45.114 C 311.397,56.701 267.658,62.549 224.536,62.317 Z"
                    className={fillClass}
                    fill="#000000"
                    strokeLinecap="round"
                    stroke="none"
                    strokeWidth="3.929"
                    strokeLinejoin="miter"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    );
};
