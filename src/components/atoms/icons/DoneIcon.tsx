// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

/* exported components */

export const DoneIcon: React.FC<{}> = () => (
    <>
        <svg
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
                <path
                    d="M 34.252,21.221 L 21.519,32.396 C 20.969,32.957 20.813,33.723 21.171,34.086 L 24.215,37.798 C 24.581,38.171 25.33,38.009 25.881,37.449 L 33.734,30.823 L 48.029,53.471 C 48.579,54.031 49.331,54.19 49.688,53.826 L 53.781,50.572 C 54.148,50.199 53.989,49.436 53.439,48.876 L 35.929,21.581 C 35.374,21.015 34.619,20.847 34.252,21.221 Z"
                    className={baseCss.fill}
                    fill="#0d2644"
                    stroke="none"
                    strokeLinejoin="miter"
                    strokeWidth="0.049"
                    strokeLinecap="round"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    </>
);
