// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type DragIconProps = StandardInvertibleComponentProps;

export const DragIcon: React.FC<DragIconProps> = (props) => {
    const { fillClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    return (
        <>
            <svg
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
                width="75pt"
                height="75pt"
                viewBox="0 -75 75 75"
            >
                <defs />
                <g id="Layer 1" transform="scale(1 -1)">
                    <g
                        id="Group"
                        className={fillClass}
                        strokeLinejoin="miter"
                        strokeLinecap="round"
                        stroke="none"
                        strokeWidth="5.348"
                        fill="black"
                    >
                        <rect x="-2.355" y="-22.499" width="4.71" height="44.998" transform="translate(37.501 51.646) rotate(90)" />
                        <rect x="-2.355" y="-22.499" width="4.71" height="44.998" transform="translate(37.501 37.502) rotate(90)" />
                        <rect
                            x="-2.356"
                            y="-22.499"
                            width="4.712"
                            height="44.998"
                            transform="translate(37.501 23.357) rotate(90)"
                        />
                    </g>
                </g>
            </svg>
        </>
    );
};
