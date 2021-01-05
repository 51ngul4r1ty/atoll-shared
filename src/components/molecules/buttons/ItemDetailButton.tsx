// externals
import * as React from "react";
import { buildClassName } from "../../../utils";

// components
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";

// style
import css from "./ItemDetailButton.module.css";

export interface ItemDetailButtonStateProps {
    itemType: string;
    itemId: string;
    hasDetails: boolean;
    className: string;
}

export interface ItemDetailButtonDispatchProps {
    onDetailClick: { (): void };
}

export type ItemDetailButtonProps = ItemDetailButtonStateProps & ItemDetailButtonDispatchProps;

export const ItemDetailButton: React.FC<ItemDetailButtonProps> = (props) =>
    props.hasDetails ? (
        <div
            data-class="item-menu-button"
            data-item-id={props.itemId}
            data-item-type={props.itemType}
            className={buildClassName(css.itemDetailButton, props.className)}
            onClick={() => {
                if (props.onDetailClick) {
                    props.onDetailClick();
                }
            }}
        >
            <EditDetailIcon />
        </div>
    ) : null;
