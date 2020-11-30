// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type StatusDoneIconProps = StandardInvertibleComponentProps;

export const StatusDoneIcon: React.FC<StatusDoneIconProps> = (props) => {
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
                        d="M 35.444,28.821 L 29.136,34.359 C 28.863,34.636 28.786,35.017 28.962,35.197 L 30.471,37.035 C 30.652,37.22 31.025,37.139 31.297,36.862 L 35.188,33.579 L 42.27,44.801 C 42.543,45.078 42.914,45.158 43.092,44.976 L 45.12,43.365 C 45.303,43.18 45.223,42.802 44.95,42.523 L 36.275,29 C 36.001,28.721 35.626,28.636 35.444,28.821 Z"
                        strokeWidth="0.023"
                        strokeLinecap="round"
                        markerStart="none"
                        markerEnd="none"
                    />
                    <path
                        d="M 23.725,28.417 C 18.711,36.02 20.813,46.261 28.417,51.275 C 36.02,56.289 46.261,54.187 51.275,46.583 C 56.289,38.98 54.187,28.739 46.583,23.725 C 38.98,18.711 28.739,20.813 23.725,28.417 Z M 44.725,26.543 C 50.773,30.532 52.445,38.678 48.457,44.725 C 44.468,50.773 36.322,52.445 30.275,48.457 C 24.227,44.468 22.555,36.322 26.543,30.275 C 30.532,24.227 38.678,22.555 44.725,26.543 Z"
                        strokeWidth="0.26"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </g>
        </svg>
    );
};
