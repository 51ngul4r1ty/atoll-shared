// externals
import React, { Component, ChangeEvent } from "react";

// style
import css from "./ItemMenuPanel.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export enum ItemMenuPanelCaretPosition {
    TopLeft,
    TopCenter,
    RightTop
}

export enum ItemMenuPanelColor {
    Light = 1, // the default
    Dark = 2
}

export interface ItemMenuPanelStateProps {
    caretPosition: ItemMenuPanelCaretPosition;
    panelColor?: ItemMenuPanelColor;
    className?: string;
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
            this.props.caretPosition === ItemMenuPanelCaretPosition.RightTop ? css.rightTopCaret : null,
            this.props.caretPosition === ItemMenuPanelCaretPosition.TopLeft ? css.topLeftCaret : null,
            this.props.panelColor === ItemMenuPanelColor.Dark ? css.dark : css.light
        );
        return (
            <div data-class="item-menu-panel" className={classToUse}>
                <div className={css.triangle}></div>
                <div className={css.panel}>{this.props.children}</div>
            </div>
        );
    }
}
