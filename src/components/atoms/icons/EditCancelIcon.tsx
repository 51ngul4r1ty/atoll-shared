// externals
import * as React from "react";

// style
import css from "../../common/base.module.css";

/* exported components */

export const EditCancelIcon: React.FC<{}> = () => (
    <svg
        strokeWidth="0.501"
        strokeLinejoin="bevel"
        strokeMiterlimit="10"
        fill="none"
        fillRule="evenodd"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        overflow="visible"
        width="75px"
        height="75px"
        viewBox="0 -75 75 75"
    >
        <defs />
        <g id="Document" className={css.stroke} fill="none" stroke="black" transform="scale(1 -1)">
            <g id="Group" className={css.fill} fill="black" strokeLinecap="round" stroke="none">
                <path
                    d="M 21.001,21.004 L 21.001,30.065 L 31.986,41.051 L 33.559,38.441 L 27.644,32.527 C 27.543,32.425 27.492,32.302 27.492,32.157 C 27.492,31.837 27.652,31.677 27.971,31.677 C 28.116,31.677 28.24,31.728 28.341,31.83 L 34.083,37.572 L 38.801,29.743 L 30.062,21.004 L 21.001,21.004 Z M 28.908,23.792 L 30.89,25.774 L 25.771,30.893 L 23.789,28.911 L 23.789,26.58 L 26.577,26.58 L 26.577,23.792 L 28.908,23.792 Z M 43.008,33.95 L 38.289,41.778 L 40.147,43.636 C 40.249,43.737 40.3,43.861 40.3,44.007 C 40.3,44.325 40.14,44.485 39.82,44.485 C 39.675,44.485 39.552,44.434 39.45,44.332 L 37.765,42.648 L 36.192,45.257 L 39.124,48.189 L 48.185,39.127 L 43.008,33.95 Z M 49.579,40.52 L 40.518,49.583 L 44.134,53.177 C 44.656,53.729 45.31,54.004 46.094,54.004 C 46.865,54.004 47.524,53.729 48.076,53.177 L 53.195,48.08 C 53.732,47.513 54.001,46.852 54.001,46.098 C 54.001,45.327 53.732,44.674 53.195,44.136 L 49.579,40.52 Z"
                    fillRule="nonzero"
                    strokeLinejoin="round"
                    strokeWidth="1.464"
                    markerStart="none"
                    markerEnd="none"
                />
                <path
                    d="M 48.469,16.499 L 50.998,17.898 L 26.526,58.499 L 23.998,57.102 L 48.469,16.499 Z"
                    strokeLinejoin="miter"
                    strokeWidth="1.56"
                    markerStart="none"
                    markerEnd="none"
                />
            </g>
        </g>
    </svg>
);
