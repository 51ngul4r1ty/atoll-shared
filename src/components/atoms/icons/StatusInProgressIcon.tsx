// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type StatusInProgressIconProps = StandardInvertibleComponentProps;

export const StatusInProgressIcon: React.FC<StatusInProgressIconProps> = (props) => {
    const { fillClass, strokeClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    return (
        <svg
            fill="none"
            className={strokeClass}
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
            <defs>
            </defs>
            <g
                id="Layer 1"
                transform="scale(1 -1)"
            >
                <g
                    id="Group"
                    className={fillClass}
                    strokeLinejoin="miter"
                    stroke="none"
                    fill="#0d2644"
                >
                    <path
                        d="M 35.372,21.129 L 35.373,21.133 L 35.765,24.48 C 38.769,24.098 41.918,24.746 44.643,26.543 C 50.692,30.531 52.364,38.677 48.375,44.725 C 45.525,49.046 40.554,51.133 35.742,50.519 L 35.742,50.518 L 35.352,53.872 C 41.389,54.627 47.618,52.002 51.193,46.583 C 56.207,38.98 54.105,28.739 46.501,23.725 C 43.086,21.472 39.138,20.656 35.372,21.129 Z M 28.533,23.591 L 28.536,23.596 L 30.344,26.44 C 31.185,25.903 32.08,25.468 33.01,25.138 L 31.905,21.951 L 31.905,21.949 C 30.729,22.364 29.597,22.913 28.533,23.591 Z M 23.643,28.417 C 23.575,28.52 23.508,28.623 23.442,28.727 L 23.455,28.735 L 26.308,30.511 C 26.358,30.432 26.409,30.353 26.461,30.275 C 26.96,29.517 27.524,28.828 28.141,28.211 L 25.77,25.828 L 25.76,25.818 C 24.982,26.595 24.271,27.463 23.643,28.417 Z M 21.029,35.567 L 21.032,35.567 L 24.384,35.932 C 24.5,34.959 24.726,33.993 25.066,33.052 L 21.901,31.932 L 21.884,31.926 C 21.456,33.116 21.172,34.338 21.029,35.567 Z M 24.355,38.77 L 21,39.135 C 21.125,40.388 21.394,41.624 21.799,42.818 L 24.979,41.688 C 24.661,40.741 24.451,39.762 24.355,38.77 Z M 26.178,44.281 L 23.314,46.069 C 23.963,47.139 24.74,48.145 25.64,49.06 L 28.02,46.655 L 28.015,46.66 C 27.304,45.932 26.691,45.132 26.178,44.281 Z M 30.241,48.485 L 28.436,51.341 C 29.52,52.044 30.657,52.604 31.823,53.026 L 32.926,49.83 L 32.925,49.834 C 32,49.497 31.099,49.049 30.24,48.488 L 30.241,48.485 Z"
                        strokeWidth="0.26"
                        markerStart="none"
                        markerEnd="none"
                    />
                    <path
                        d="M 35.444,28.821 L 29.136,34.359 C 28.863,34.636 28.786,35.017 28.962,35.197 L 30.471,37.035 C 30.652,37.22 31.025,37.139 31.297,36.862 L 35.188,33.579 L 42.27,44.801 C 42.543,45.078 42.914,45.158 43.092,44.976 L 45.12,43.365 C 45.303,43.18 45.223,42.802 44.95,42.523 L 36.275,29 C 36.001,28.721 35.626,28.636 35.444,28.821 Z"
                        strokeWidth="0.023"
                        strokeLinecap="round"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </g>
        </svg>
    );
};
