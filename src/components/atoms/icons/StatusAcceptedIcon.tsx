// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type StatusAcceptedIconProps = StandardInvertibleComponentProps;

export const StatusAcceptedIcon: React.FC<StatusAcceptedIconProps> = (props) => {
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
                    d="M 37.125,17.623 L 32.857,21.278 L 27.56,20.287 L 25.662,25.669 L 20.287,27.562 L 21.335,33.169 L 17.625,37.499 L 21.132,41.591 L 20.1,47.111 L 25.267,48.929 L 27.238,54.522 L 32.622,53.513 L 37.125,57.372 L 41.519,53.603 L 47.435,54.71 L 49.327,49.331 L 54.71,47.436 L 53.66,41.83 L 57.374,37.499 L 53.457,32.93 L 54.523,27.236 L 48.931,25.266 L 47.112,20.099 L 41.284,21.188 L 37.125,17.623 Z M 36.275,29 L 44.95,42.523 C 45.223,42.802 45.303,43.18 45.12,43.365 L 43.092,44.976 C 42.914,45.158 42.543,45.078 42.27,44.801 L 35.188,33.579 L 31.297,36.862 C 31.025,37.139 30.652,37.22 30.471,37.035 L 28.962,35.197 C 28.786,35.017 28.863,34.636 29.136,34.359 L 35.444,28.821 C 35.626,28.636 36.001,28.721 36.275,29 Z"
                    className={fillClass}
                    strokeLinecap="round"
                    fill="#0d2644"
                    stroke="none"
                    strokeLinejoin="miter"
                    strokeWidth="0.724"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    );
};
