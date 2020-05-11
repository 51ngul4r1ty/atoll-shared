// externals
import React, { forwardRef, Component, ChangeEvent, RefObject, Ref } from "react";

// style
import css from "./ItemMenuPanel.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
// import { ComponentWithForwardedRef } from "../../../types";

// export type ItemMenuPanelRefType = HTMLInputElement;

// export type ItemMenuPanelType = ComponentWithForwardedRef<ItemMenuPanelProps>;

export interface ItemMenuPanelStateProps {
    className?: string;
    // inputId: string;
    // inputName?: string;
    // inputValue: string;
    // labelText: string;
    // placeHolder?: string;
    // required?: boolean;
    // size?: number;
    // type?: string;
}

// NOTE: Keep this private so that it isn't referenced outside this component
// interface ItemMenuPanelInnerStateProps {
//     // innerRef: RefObject<ItemMenuPanelRefType>;
// }

export interface ItemMenuPanelDispatchProps {
    onOpen?: { () };
    onClose?: { () };
}

export type ItemMenuPanelProps = ItemMenuPanelStateProps & ItemMenuPanelDispatchProps;

export class ItemMenuPanel extends Component<ItemMenuPanelProps /* & ItemMenuPanelInnerStateProps */> {
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
    componentDidMount() {
        // if (this.props.innerRef?.current) {
        //     this.props.innerRef.current.addEventListener("keyup", this.handleKeyUp.bind(this));
        // }
    }
    componentWillUnmount() {
        // if (this.props.innerRef?.current) {
        //     this.props.innerRef.current.removeEventListener("keyup", this.handleKeyUp);
        // }
    }
    render() {
        // const nameToUse = this.props.inputName || this.props.inputId;
        // const valueToUse = this.props.inputValue || "";
        const classToUse = buildClassName(css.component, this.props.className);
        // const typeToUse = this.props.type || "text";
        return (
            <div className={classToUse}>
                <div className={css.triangle}></div>
                <div className={css.panel}>{this.props.children}</div>
            </div>
        );
    }
}

// export const ItemMenuPanel: ItemMenuPanelType = forwardRef((props: ItemMenuPanelProps, ref: Ref<ItemMenuPanelRefType>) => (
//     <InnerItemMenuPanel innerRef={ref as RefObject<ItemMenuPanelRefType>} {...props} />
// ));
