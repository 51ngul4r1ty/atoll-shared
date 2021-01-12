// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type DatePickerButtonIconProps = StandardInvertibleComponentProps;

export const DatePickerButtonIcon: React.FC<DatePickerButtonIconProps> = (props) => {
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
                <g
                    id="Group"
                >
                    <path
                        d="M 21,23.359 L 21,48.707 C 21,50.01 22.062,51.067 23.369,51.067 L 25.498,51.067 L 25.498,46.706 C 25.498,45.47 26.525,44.466 27.789,44.466 L 29.958,44.466 C 31.222,44.466 32.249,45.47 32.249,46.706 L 32.249,51.067 L 42.75,51.067 L 42.75,46.706 C 42.75,45.47 43.777,44.466 45.041,44.466 L 47.21,44.466 C 48.474,44.466 49.501,45.47 49.501,46.706 L 49.501,51.067 L 51.631,51.067 C 52.938,51.067 54,50.01 54,48.707 L 54,23.359 C 54,22.057 52.938,21 51.631,21 L 23.369,21 C 22.062,21 21,22.057 21,23.359 Z M 51.188,23.8 L 51.188,42.518 L 23.664,42.518 L 23.664,23.8 L 51.188,23.8 Z"
                        className={fillClass}
                        fill="#0d2644"
                        stroke="none"
                        strokeLinejoin="miter"
                        strokeWidth="0.262"
                        markerStart="none"
                        markerEnd="none"
                    />
                    <g
                        id="Group_1"
                    >
                        <path
                            d="M 26.25,31.266 L 26.25,34.933 L 30.771,34.933 L 30.771,31.266 L 26.25,31.266 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 32.25,31.266 L 32.25,34.933 L 36.771,34.933 L 36.771,31.266 L 32.25,31.266 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 38.25,31.266 L 38.25,34.933 L 42.771,34.933 L 42.771,31.266 L 38.25,31.266 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 44.25,31.266 L 44.25,34.933 L 48.771,34.933 L 48.771,31.266 L 44.25,31.266 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 26.25,26.132 L 26.25,29.8 L 30.771,29.8 L 30.771,26.132 L 26.25,26.132 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 32.25,26.132 L 32.25,29.8 L 36.771,29.8 L 36.771,26.132 L 32.25,26.132 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 38.25,26.132 L 38.25,29.8 L 42.771,29.8 L 42.771,26.132 L 38.25,26.132 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 44.25,26.132 L 44.25,29.8 L 48.771,29.8 L 48.771,26.132 L 44.25,26.132 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 38.25,36.399 L 38.25,40.067 L 42.771,40.067 L 42.771,36.399 L 38.25,36.399 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                        <path
                            d="M 44.25,36.399 L 44.25,40.067 L 48.771,40.067 L 48.771,36.399 L 44.25,36.399 Z"
                            className={fillClass}
                            fill="#0d2644"
                            stroke="none"
                            strokeLinejoin="miter"
                            strokeWidth="0.049"
                            markerStart="none"
                            markerEnd="none"
                        />
                    </g>
                </g>
                <rect
                    x="-4.106"
                    className={fillClass}
                    y="-1.874"
                    width="8.213"
                    height="3.749"
                    rx="15.3343078103522"
                    ry="15.3343078103522"
                    transform="translate(28.875 49.893) rotate(90)"
                    fill="#0d2644"
                    strokeLinejoin="miter"
                    stroke="none"
                    strokeWidth="0.261"
                />
                <rect
                    x="-4.106"
                    className={fillClass}
                    y="-1.874"
                    width="8.213"
                    height="3.749"
                    rx="18.0038708499442"
                    ry="18.0038708499442"
                    transform="translate(46.127 49.893) rotate(90)"
                    fill="#0d2644"
                    strokeLinejoin="miter"
                    stroke="none"
                    strokeWidth="0.261"
                />
            </g>
        </svg>
    );
};
