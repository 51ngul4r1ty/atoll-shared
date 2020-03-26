// externals
import * as React from "react";

// style
import css from "../../common/base.module.css";

/* exported components */

export const RefreshIcon: React.FC<{}> = () => (
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
                d="M 49.741,24.372 C 50.296,24.974 50.897,25.489 51.452,26.129 C 51.596,26.295 51.736,26.598 51.643,26.815 L 51.581,26.962 L 51.423,27.152 L 48.284,30.421 C 48.205,30.463 48.11,30.505 48.014,30.495 C 47.603,30.54 46.725,29.398 46.036,28.756 C 41.072,24.132 33.289,24.408 28.665,29.373 C 24.04,34.337 24.317,42.12 29.282,46.744 C 34.042,51.179 41.395,51.106 46.068,46.717 L 42.319,42.984 C 42.249,42.916 42.169,42.829 42.137,42.757 C 42.102,42.677 42.08,42.574 42.06,42.46 C 41.915,41.643 42.885,40.553 43.881,40.553 L 53.875,40.553 C 54.328,40.553 54.743,40.72 55.059,40.995 L 55.202,40.848 L 55.221,40.828 C 55.204,40.919 55.188,41.01 55.17,41.1 C 55.485,41.427 55.681,41.87 55.681,42.359 L 55.681,52.547 C 55.681,53.544 55.102,54.196 54.106,54.196 C 53.86,54.209 53.715,54.205 53.512,54.093 L 53.336,53.949 L 49.998,50.627 C 43.126,57.293 32.147,57.468 25.061,50.87 C 17.748,44.058 17.341,32.595 24.152,25.281 C 30.965,17.967 42.429,17.56 49.741,24.372 Z"
                className={css.fill}
                fill="#0d2644"
                stroke="none"
                strokeLinejoin="miter"
                markerStart="none"
                markerEnd="none"
            />
        </g>
    </svg>
);
