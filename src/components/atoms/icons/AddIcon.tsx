// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

/* exported components */

export const AddIcon: React.FC<{}> = () => (
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
                    d="M 34.2,22.459 L 34.2,34.2 L 22.459,34.2 C 21.673,34.2 21.022,34.618 21.022,35.137 L 21.022,39.872 C 21.022,40.378 21.673,40.8 22.459,40.8 L 34.2,40.8 L 34.2,52.556 C 34.2,53.336 34.622,53.978 35.128,53.978 L 39.863,53.978 C 40.382,53.978 40.8,53.336 40.8,52.556 L 40.8,40.8 L 52.556,40.8 C 53.336,40.8 53.978,40.378 53.978,39.872 L 53.978,35.137 C 53.978,34.618 53.336,34.2 52.556,34.2 L 40.8,34.2 L 40.8,22.459 C 40.8,21.673 40.382,21.022 39.863,21.022 L 35.128,21.022 C 34.622,21.022 34.2,21.673 34.2,22.459 Z"
                    className={baseCss.fill}
                    stroke="none"
                    strokeLinejoin="miter"
                    strokeWidth="0.048"
                    strokeLinecap="round"
                    fill="#0d2644"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    </>
);
