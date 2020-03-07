// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

/* exported components */

export const CancelIcon: React.FC<{}> = () => (
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
                    d="M 48.74,21.555 L 37.499,32.795 L 26.26,21.555 C 25.699,20.995 24.937,20.829 24.567,21.199 L 21.193,24.574 C 20.832,24.934 20.995,25.699 21.555,26.26 L 32.795,37.5 L 21.544,48.752 C 20.989,49.307 20.832,50.066 21.193,50.426 L 24.567,53.801 C 24.937,54.171 25.693,54.011 26.248,53.456 L 37.499,42.204 L 48.752,53.456 C 49.307,54.011 50.066,54.168 50.426,53.807 L 53.801,50.433 C 54.171,50.063 54.011,49.307 53.456,48.752 L 42.204,37.5 L 53.445,26.26 C 54.005,25.699 54.171,24.937 53.801,24.567 L 50.426,21.193 C 50.066,20.832 49.301,20.995 48.74,21.555 Z"
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
