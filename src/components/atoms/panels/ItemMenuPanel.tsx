// externals
import React, { Component, ChangeEvent } from "react";

// style
import css from "./ItemMenuPanel.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// components
import { SmartSpinner } from "../../molecules/unique/smartSpinner/SmartSpinner";

// consts/enums
import { ITEM_MENU_PANEL_DATA_CLASS } from "../../common/consts";
import { SpinnerAction } from "../../molecules/unique/smartSpinner/smartSpinnerEnums";

export enum ItemMenuPanelCaretPosition {
    TopLeft,
    TopCenter,
    TopRight,
    RightTop,
    BottomLeft
}

export enum ItemMenuPanelColor {
    Light = 1, // the default
    Dark = 2
}

export interface ItemMenuPanelStateProps {
    caretPosition: ItemMenuPanelCaretPosition;
    className?: string;
    itemId?: string;
    itemType?: string;
    panelColor?: ItemMenuPanelColor;
    loading?: boolean;
}

export interface ItemMenuPanelDispatchProps {
    onOpen?: { () };
    onClose?: { () };
}

export type ItemMenuPanelProps = ItemMenuPanelStateProps & ItemMenuPanelDispatchProps;

export class ItemMenuPanel extends Component<ItemMenuPanelProps> {
    constructor(props) {
        super(props);
    }
    handleOpen(e: ChangeEvent<HTMLInputElement>) {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }
    handleClose(e: ChangeEvent<HTMLInputElement>) {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    render() {
        const classToUse = buildClassName(
            css.component,
            this.props.className,
            !this.props.caretPosition || this.props.caretPosition === ItemMenuPanelCaretPosition.TopCenter ? css.topCenter : null,
            this.props.caretPosition === ItemMenuPanelCaretPosition.RightTop ? css.rightTopCaret : null,
            this.props.caretPosition === ItemMenuPanelCaretPosition.TopLeft ? css.topLeftCaret : null,
            this.props.caretPosition === ItemMenuPanelCaretPosition.BottomLeft ? css.bottomLeftCaret : null,
            this.props.caretPosition === ItemMenuPanelCaretPosition.TopRight ? css.topRightCaret : null,
            this.props.panelColor === ItemMenuPanelColor.Dark ? css.dark : css.light
        );
        const content = this.props.loading ? (
            <SmartSpinner
                action={SpinnerAction.Loading}
                entityNameTemplate={""}
                expectedTime={0}
                metricEntityKey={""}
                metricKey={""}
                quantity={0}
            />
        ) : (
            this.props.children
        );
        return (
            <div
                data-class={ITEM_MENU_PANEL_DATA_CLASS}
                data-item-id={this.props.itemId}
                data-item-type={this.props.itemType}
                className={classToUse}
            >
                <div className={css.triangle}></div>
                <div className={css.panel}>{content}</div>
            </div>
        );
    }
}
