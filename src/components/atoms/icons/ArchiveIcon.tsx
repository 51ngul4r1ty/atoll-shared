// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type ArchiveIconProps = StandardInvertibleComponentProps;

export const ArchiveIcon: React.FC<ArchiveIconProps> = (props) => {
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
            <defs></defs>
            <g id="Layer 1" transform="scale(1 -1)">
                <g id="Group" className={fillClass} strokeLinejoin="miter" stroke="none" fill="#0d2644">
                    <path
                        d="M 29.254,49.398 L 29.254,50.393 C 29.254,50.726 29.212,50.959 30.202,50.996 L 44.85,50.996 C 45.677,51.039 45.718,50.726 45.718,50.393 L 45.718,49.398 L 29.254,49.398 Z"
                        markerStart="none"
                        markerEnd="none"
                    />
                    <path
                        d="M 25.897,44.283 L 25.897,46.471 C 25.897,47.205 25.935,47.762 27.023,47.799 L 48.029,47.799 C 49.194,47.842 49.235,47.205 49.235,46.471 L 49.235,44.283 L 25.897,44.283 Z"
                        markerStart="none"
                        markerEnd="none"
                    />
                    <path
                        d="M 50.628,23.981 L 24.654,24.021 C 24.351,24.021 24.084,24.114 23.882,24.377 L 21.001,41.707 C 20.992,42.176 21.041,42.945 21.619,43.366 L 23.458,45.205 L 23.458,42.524 L 51.563,42.524 L 51.543,45.252 L 53.441,43.414 C 54.021,42.875 54.001,42.276 54.001,41.656 L 51.324,24.377 C 51.203,24.157 50.951,24.042 50.628,23.981 Z M 32.112,33.076 L 42.982,33.115 C 43.85,33.399 44.201,33.965 44.221,34.674 L 44.221,38.07 L 41.902,38.07 L 41.902,35.394 L 33.194,35.432 L 33.193,38.071 L 30.873,38.07 L 30.873,34.435 C 30.873,33.822 31.369,33.198 32.112,33.076 Z"
                        markerStart="none"
                        markerEnd="none"
                    />
                </g>
            </g>
        </svg>
    );
};
