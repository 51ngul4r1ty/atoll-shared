// externals
import * as React from "react";
import { buildClassName } from "../../../utils";

// components
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";

// style
import css from "./ItemDetailButton.module.css";

export interface ItemDetailButtonStateProps {
    hasDetails: boolean;
    className: string;
}

export interface ItemDetailButtonDispatchProps {
    onDetailClicked: { (): void };
}

export type ItemDetailButtonProps = ItemDetailButtonStateProps & ItemDetailButtonDispatchProps;

export const ItemDetailButton: React.FC<ItemDetailButtonProps> = (props) =>
    props.hasDetails ? (
        <div
            data-class="item-menu-button"
            className={buildClassName(css.itemDetailButton, props.className)}
            onClick={() => {
                if (props.onDetailClicked) {
                    props.onDetailClicked();
                }
            }}
        >
            <EditDetailIcon />
        </div>
    ) : null;
