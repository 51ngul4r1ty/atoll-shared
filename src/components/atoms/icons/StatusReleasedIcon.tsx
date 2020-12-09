// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type StatusReleasedIconProps = StandardInvertibleComponentProps;

export const StatusReleasedIcon: React.FC<StatusReleasedIconProps> = (props) => {
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
                <path
                    d="M 50.248,25.5 L 24.15,25.575 C 20.66,25.5 18.157,28.686 18.005,32.935 C 17.832,37.785 21.938,41.147 25.516,40.824 C 25.045,43.512 26.155,45.685 27.944,46.969 C 29.959,48.416 32.697,48.442 35.379,47.348 C 37.354,49.319 39.6,50.077 41.978,50.231 C 46.66,50.536 51.726,46.385 52.524,40.824 C 55.279,39.613 56.996,36.491 57,33.693 C 57.007,29.141 54.048,25.5 50.248,25.5 Z M 36.275,29 L 44.95,42.523 C 45.223,42.802 45.303,43.18 45.12,43.365 L 43.092,44.976 C 42.914,45.158 42.543,45.078 42.27,44.801 L 35.188,33.579 L 31.297,36.862 C 31.025,37.139 30.652,37.22 30.471,37.035 L 28.962,35.197 C 28.786,35.017 28.863,34.636 29.136,34.359 L 35.444,28.821 C 35.626,28.636 36.001,28.721 36.275,29 Z"
                    className={fillClass}
                    fill="#0d2644"
                    stroke="none"
                    strokeLinejoin="miter"
                    strokeWidth="0.575"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    );
};
