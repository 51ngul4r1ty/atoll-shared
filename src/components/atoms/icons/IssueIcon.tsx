// externals
import * as React from "react";

// style
import baseCss from "./common/base.module.css";

/* exported components */

export const IssueIcon: React.FC<{}> = () => (
    <>
        <svg
            fill="none"
            fillRule="evenodd"
            className={baseCss.strokeInverted}
            stroke="black"
            strokeWidth="0.501"
            strokeLinejoin="bevel"
            strokeMiterlimit="10"
            fontFamily="Times New Roman"
            fontSize="16"
            style={{ fontVariantLigatures: "none" }}
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            overflow="visible"
            width="450pt"
            height="450pt"
            viewBox="0 -450 450 450"
        >
            <defs />
            <g id="Layer 1" transform="scale(1 -1)">
                <path
                    d="M 114.89,31.679 L 37.443,167.245 L 146.348,161.257 C 197.162,164.3 187.591,124.209 128.537,48.77 L 213.362,124.752 C 247.14,162.832 268.722,127.717 280.309,32.618 L 286.563,146.334 C 283.581,196.128 322.02,187.936 394.551,132.017 L 337.206,31.679 L 114.89,31.679 Z M 395.084,132.949 L 323.068,213.353 C 284.987,247.132 320.102,268.714 415.201,280.301 L 301.486,286.56 C 250.672,283.517 260.243,323.608 319.297,399.041 L 234.466,323.059 C 200.688,284.979 179.106,320.094 167.525,415.193 L 161.271,301.477 C 164.237,251.946 126.219,259.79 54.428,314.911 L 54.454,314.956 L 114.908,420.751 L 337.224,420.751 L 448.382,226.206 L 395.084,132.949 Z M 36.961,168.088 L 3.75,226.224 L 53.757,313.736 L 124.766,234.458 C 162.261,201.199 128.794,179.764 36.982,168.052 L 36.961,168.088 Z"
                    className={baseCss.fillInverted}
                    fill="#000000"
                    strokeLinecap="round"
                    strokeWidth="11.108"
                    strokeLinejoin="miter"
                    stroke="none"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </svg>
    </>
);
