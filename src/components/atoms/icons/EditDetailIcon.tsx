// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";

export type EditDetailIconProps = StandardInvertibleComponentProps;

export const EditDetailIcon: React.FC<EditDetailIconProps> = (props) => {
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
                <defs></defs>
                <g id="Layer 1" transform="scale(1 -1)">
                    <g
                        id="Group"
                        strokeLinejoin="miter"
                        strokeLinecap="round"
                        stroke="none"
                        strokeWidth="0.023"
                        fill="black"
                        className={fillClass}
                    >
                        <ellipse rx="3.3" ry="3.3" transform="translate(37.488 50.674) rotate(137.124)" />
                        <ellipse rx="3.3" ry="3.3" transform="translate(37.5 37.5) rotate(137.124)" />
                        <ellipse rx="3.3" ry="3.3" transform="translate(37.5 24.3) rotate(137.124)" />
                    </g>
                </g>
            </svg>
        </>
    );
};
