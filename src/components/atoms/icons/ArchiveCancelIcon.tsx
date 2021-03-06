// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type ArchiveCancelIconProps = StandardInvertibleComponentProps;

export const ArchiveCancelIcon: React.FC<ArchiveCancelIconProps> = (props) => {
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
            <defs></defs>
            <g id="Layer 1" transform="scale(1 -1)">
                <g id="Group" className={fillClass} strokeLinejoin="miter" stroke="none" fill="#0d2644">
                    <g id="Group_1">
                        <path
                            d="M 33.754,49.398 L 32.797,50.996 L 44.85,50.996 C 45.677,51.039 45.718,50.726 45.718,50.393 L 45.718,49.398 L 33.754,49.398 Z"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 25.897,44.283 L 25.897,46.471 C 25.897,47.205 25.935,47.762 27.023,47.799 L 27.945,47.799 L 30.055,44.283 L 25.897,44.283 Z M 36.818,44.283 L 34.712,47.799 L 48.029,47.799 C 49.194,47.842 49.235,47.205 49.235,46.471 L 49.235,44.283 L 36.818,44.283 Z"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 50.628,23.981 L 48.979,23.983 L 43.402,33.295 C 43.965,33.607 44.204,34.092 44.221,34.674 L 44.221,38.07 L 41.902,38.07 L 41.902,35.798 L 37.872,42.524 L 51.563,42.524 L 51.543,45.252 L 53.441,43.414 C 54.021,42.875 54.001,42.276 54.001,41.656 L 51.324,24.377 C 51.203,24.157 50.951,24.042 50.628,23.981 Z M 42.228,23.993 L 24.654,24.021 C 24.351,24.021 24.084,24.114 23.882,24.377 L 21.001,41.707 C 20.992,42.176 21.041,42.945 21.619,43.366 L 23.458,45.205 L 23.458,42.524 L 31.11,42.524 L 35.371,35.422 L 33.194,35.432 L 33.193,38.071 L 30.873,38.07 L 30.873,34.435 C 30.873,33.822 31.369,33.198 32.112,33.076 L 36.769,33.092 L 42.228,23.993 Z"
                            markerStart="none"
                            markerEnd="none"
                        />
                    </g>
                    <path
                        d="M 48.469,16.499 L 50.998,17.898 L 26.526,58.499 L 23.998,57.102 L 48.469,16.499 Z"
                        strokeLinecap="round"
                        strokeWidth="1.56"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </g>
        </svg>
    );
};
