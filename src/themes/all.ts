/*

  Theme Variable Naming
  =====================

  Overview
  --------

  Think of the web page as a blank canvas.  You're given a page of a particular color and a pen of a particular color.
  Those two colors are the most basic "build blocks" of your theme.

  Basic Building Blocks
  ---------------------

  page & pen
    - while "background" and "foreground" are often used for this we chose "page" and "pen"
      instead to avoid direct comparison with the CSS property "background-color"
      ("page-color" and "pen-color" won't match typical CSS property names)

  Using these 2 types of building blocks we append `-color` to come up with (1) page-color and (2) pen-color.
  When building new colors that are a part of our theme we can prepend other modifier (see sections below).


  Normal/Inverted Modifiers
  -------------------------

  While page & pen may seem like two obvious contrasting colors in our theme we can't just use them as named in all
  situations, even when the color values may match.  One of those cases is inverted elements.  It would be confusing
  to use `backgroud-color: var(--pen-color)` and `color: var(--page-color)` for these inverted elements.  Instead,
  we'll prepend `normal-` for the typical case and `inverted-` for the inverse case:
    (1) normal-pen-color
    (2) normal-page-color
    (3) inverted-pen-color
    (4) inverted-page-color


  States
  ------

  There are a few element states that we'll also need to represent in our naming convention:
    (a) Enabled/Disabled
    (b) Active/Hover/Focus/Visited

  So we expand our naming convention to cover those:
    (1) normal-active-page-color, normal-active-pen-color
    (2) normal-focus-page-color, normal-focus-pen-color
    (3) normal-disabled-page-color, normal-disabled-pen-color

  Hovering works a little differently because a shadow is often used for this style:
    (4) normal-hover-shadow, normal-hover-shadow-size


  Font Sizes
  ----------

  Sizing is generally done using T-shirt sizing so we'll use that convention:
    (1) Extra Small - `xsmall-`
    (2) Small - `small-`
    (3) Medium - `medium-`
    (4) Large - `large-`
    (5) Extra Large - xlarge-`

*/

export interface Theme {
    "--normal-page-color": string;
    "--normal-page-alt1-color": string;
    "--normal-pen-color": string;
    "--normal-pen-disabled-color": string;
    "--normal-placeholder-color": string;
    "--normal-light-border-color": string;
    "--normal-divider-color": string;
    "--normal-active-page-color": string;
    "--normal-error-pen-color": string;
    "--normal-error-page-color": string;
    "--normal-form-header-page-color": string;
    "--normal-form-page-color": string;
    "--normal-form-page-readonly-color": string;
    "--normal-component-page-color": string;
    "--normal-component-pen-color": string;
    "--normal-component-primary-region-page-color": string;
    "--normal-component-primary-region-selected-page-color": string;
    "--normal-component-primary-region-selected-pen-color": string;
    "--normal-component-primary-region-border-color": string;
    "--normal-component-secondary-region-page-color": string;
    "--normal-component-secondary-region-pen-color": string;
    "--normal-component-secondary-region-border-color": string;
    "--normal-input-page-color": string;
    "--normal-input-page-disabled-color": string;
    "--normal-focus-page-color": string;
    "--normal-hover-shadow": string;
    "--normal-hover-shadow-size": string;
    "--inverted-page-color": string;
    "--inverted-pen-color": string;
    "--inverted-active-page-color": string;
    "--inverted-focus-page-color": string;
    "--inverted-page-alt1-color": string;
    "--x-small-font-size": string;
    "--small-font-size": string;
    "--medium-font-size": string;
    "--large-font-size": string;
    "--xlarge-font-size": string;
    "--primary-thin-font-weight": string;
    "--primary-light-bold-font-weight": string;
    "--primary-bold-font-weight": string;
    "--primary-heavy-bold-font-weight": string;
    "--primary-boldest-font-weight": string;
}

export const defaultTheme: Theme = {
    "--normal-page-color": "white",
    "--normal-page-alt1-color": "#eee",
    "--normal-pen-color": "black",
    "--normal-pen-disabled-color": "#999",
    "--normal-placeholder-color": "#777",
    "--normal-input-page-disabled-color": "#e0e0e0",
    "--normal-divider-color": "#f4f4f4",
    "--normal-light-border-color": "#ccc",
    "--normal-active-page-color": "#ddd",
    "--normal-error-pen-color": "#fff",
    "--normal-error-page-color": "#900",
    "--normal-form-header-page-color": "#888",
    "--normal-form-page-color": "#ddd",
    "--normal-form-page-readonly-color": "#e8e8e8",
    "--normal-component-page-color": "#ccc",
    "--normal-component-pen-color": "black",
    "--normal-component-primary-region-page-color": "white",
    "--normal-component-primary-region-selected-page-color": "black",
    "--normal-component-primary-region-selected-pen-color": "white",
    "--normal-component-primary-region-border-color": "black",
    "--normal-component-secondary-region-page-color": "#ddd",
    "--normal-component-secondary-region-pen-color": "#666" /* TODO: Check this color */,
    "--normal-component-secondary-region-border-color": "#888",
    "--normal-input-page-color": "white",
    "--normal-focus-page-color": "#eee",
    "--normal-hover-shadow": "rgba(0, 0, 0, 0.4)",
    "--normal-hover-shadow-size": "0.6rem",
    "--inverted-page-color": "black",
    "--inverted-page-alt1-color": "#777",
    "--inverted-pen-color": "white",
    "--inverted-active-page-color": "#555",
    "--inverted-focus-page-color": "#444",
    "--x-small-font-size": "0.5rem",
    "--small-font-size": "0.75rem",
    "--medium-font-size": "1.0rem",
    "--large-font-size": "1.25rem",
    "--xlarge-font-size": "1.5rem",
    "--primary-thin-font-weight": "100",
    "--primary-light-bold-font-weight": "500",
    "--primary-bold-font-weight": "600",
    "--primary-heavy-bold-font-weight": "700",
    "--primary-boldest-font-weight": "800"
};

export const darkTheme: Theme = {
    "--normal-page-color": "black",
    "--normal-page-alt1-color": "#666",
    "--normal-pen-color": "#bbb",
    "--normal-pen-disabled-color": "#888",
    "--normal-placeholder-color": "#999",
    "--normal-divider-color": "#0b0b0b",
    "--normal-light-border-color": "#333",
    "--normal-active-page-color": "#555",
    "--normal-error-page-color": "#900",
    "--normal-error-pen-color": "#fff",
    "--normal-form-header-page-color": "#909090",
    "--normal-form-page-color": "#555",
    "--normal-form-page-readonly-color": "#202020",
    "--normal-component-page-color": "#333",
    "--normal-component-pen-color": "#bbb",
    "--normal-component-primary-region-page-color": "black",
    "--normal-component-primary-region-selected-page-color": "white",
    "--normal-component-primary-region-selected-pen-color": "black",
    "--normal-component-primary-region-border-color": "white",
    "--normal-component-secondary-region-page-color": "#555",
    "--normal-component-secondary-region-pen-color": "#eee" /* TODO: Check this color */,
    "--normal-component-secondary-region-border-color": "#aaa" /* TODO: Check this color */,
    "--normal-input-page-color": "#222",
    "--normal-input-page-disabled-color": "#444",
    "--normal-focus-page-color": "#444",
    "--normal-hover-shadow": "rgba(255, 255, 255, 1.0)",
    "--normal-hover-shadow-size": "1.0rem",
    "--inverted-page-color": "#444",
    "--inverted-page-alt1-color": "#777",
    "--inverted-pen-color": "#ddd",
    "--inverted-active-page-color": "#ddd",
    "--inverted-focus-page-color": "#eee",
    "--x-small-font-size": "0.5rem",
    "--small-font-size": "0.75rem",
    "--medium-font-size": "1.0rem",
    "--large-font-size": "1.25rem",
    "--xlarge-font-size": "1.5rem",
    "--primary-thin-font-weight": "100",
    "--primary-light-bold-font-weight": "500",
    "--primary-bold-font-weight": "600",
    "--primary-heavy-bold-font-weight": "700",
    "--primary-boldest-font-weight": "800"
};

export interface ThemeListItem {
    name: string;
    theme: Theme;
}

export const themeList: ThemeListItem[] = [
    { name: "default", theme: defaultTheme },
    { name: "dark", theme: darkTheme }
];
