/* eslint-disable security/detect-object-injection */
// externals
import React from "react";

// storybook
import { storiesOf } from "@storybook/react";

// components
import {
    AddIcon,
    AppIcon,
    ArchiveIcon,
    CancelIcon,
    CheckboxCheckedIcon,
    CheckboxUncheckedIcon,
    DatePickerButtonIcon,
    DoneIcon,
    DragIcon,
    EditDetailIcon,
    EditIcon,
    HamburgerIcon,
    IssueIcon,
    MenuCaretDownIcon,
    MenuCaretUpIcon,
    ProjectIcon,
    RefreshIcon,
    StatusAcceptedIcon,
    StatusDoneIcon,
    StatusInProgressIcon,
    StatusNotStartedIcon,
    StatusReleasedIcon,
    StoryIcon,
    TrashIcon,
    VerticalCollapseIcon,
    VerticalExpandIcon
} from "../../../dist/index.es";
import { SingleIconContainer, SideBySideIconContainers } from "../../common";

// common
import "../../storybook";

const invertibleIcons = {
    AppIcon,
    ArchiveIcon,
    CheckboxCheckedIcon,
    CheckboxUncheckedIcon,
    DatePickerButtonIcon,
    DragIcon,
    EditDetailIcon,
    IssueIcon,
    MenuCaretDownIcon,
    MenuCaretUpIcon,
    ProjectIcon,
    StatusAcceptedIcon,
    StatusDoneIcon,
    StatusInProgressIcon,
    StatusNotStartedIcon,
    StatusReleasedIcon,
    StoryIcon,
    TrashIcon,
    VerticalCollapseIcon,
    VerticalExpandIcon
};

const icons = {
    ...invertibleIcons,
    AddIcon,
    ArchiveIcon,
    CancelIcon,
    CheckboxCheckedIcon,
    CheckboxUncheckedIcon,
    DatePickerButtonIcon,
    DoneIcon,
    EditIcon,
    HamburgerIcon,
    MenuCaretDownIcon,
    MenuCaretUpIcon,
    ProjectIcon,
    RefreshIcon,
    StatusAcceptedIcon,
    StatusDoneIcon,
    StatusInProgressIcon,
    StatusNotStartedIcon,
    StatusReleasedIcon,
    VerticalCollapseIcon,
    VerticalExpandIcon
};

const iconNames = [
    "AddIcon",
    "AppIcon",
    "ArchiveIcon",
    "CancelIcon",
    "CheckboxCheckedIcon",
    "CheckboxUncheckedIcon",
    "DatePickerButtonIcon",
    "DragIcon",
    "DoneIcon",
    "EditIcon",
    "EditDetailIcon",
    "RefreshIcon",
    "HamburgerIcon",
    "MenuCaretDownIcon",
    "MenuCaretUpIcon",
    "ProjectIcon",
    "IssueIcon",
    "StatusAcceptedIcon",
    "StatusDoneIcon",
    "StatusInProgressIcon",
    "StatusNotStartedIcon",
    "StatusReleasedIcon",
    "StoryIcon",
    "TrashIcon",
    "VerticalCollapseIcon",
    "VerticalExpandIcon"
];

const getComponent = (iconName: string, isInverted: boolean) => {
    const icon = icons[iconName];
    if (isInverted) {
        return React.createElement(icon, { invertColors: true }, null);
    }
    return React.createElement(icon, null, null);
};

const isInvertibleIcon = (iconName) => {
    return !!invertibleIcons[iconName];
};

iconNames.forEach((iconName) => {
    const icon = getComponent(iconName, false);
    if (isInvertibleIcon(iconName)) {
        const invertedIcon = getComponent(iconName, true);
        storiesOf("Atoms/Icons", module).add(iconName, () => <SideBySideIconContainers icon={icon} invertedIcon={invertedIcon} />);
    } else {
        storiesOf("Atoms/Icons", module).add(iconName, () => <SingleIconContainer icon={icon} />);
    }
});
