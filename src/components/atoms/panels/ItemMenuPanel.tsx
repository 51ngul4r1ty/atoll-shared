// externals
import React, { Component, ChangeEvent } from "react";

// style
import css from "./ItemMenuPanel.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export enum CaretPosition {
    TopCenter,
    RightTop
}

export interface ItemMenuPanelStateProps {
    caretPosition: CaretPosition;
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
            this.props.caretPosition === CaretPosition.RightTop ? css.rightTopCaret : null
        );
        return (
            <div className={classToUse}>
                <div className={css.triangle}></div>
                <div className={css.panel}>{this.props.children}</div>
            </div>
        );
    }
}
