// externals
import * as React from "react";

// components
import { QUANTITY_UNKNOWN, SmartSpinner, SpinnerAction, SpinnerSize, SpinnerTextPosition, TIME_UNKNOWN } from "..";
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";

// style
import css from "./ItemDetailButton.module.css";

// utils
import { buildClassName } from "../../../utils";

export interface ItemDetailButtonStateProps {
    className: string;
    hasDetails: boolean;
    isLoading?: boolean;
    itemId: string;
    itemType: string;
}

export interface ItemDetailButtonDispatchProps {
    onDetailClick: { (): void };
}

export type ItemDetailButtonProps = ItemDetailButtonStateProps & ItemDetailButtonDispatchProps;

export const ItemDetailButton: React.FC<ItemDetailButtonProps> = (props) => {
    const contentElts = props.isLoading ? (
        <SmartSpinner
            action={SpinnerAction.Loading}
            entityNameTemplate="item detail menu"
            expectedTime={TIME_UNKNOWN}
            hideActionInMessage={false}
            metricEntityKey={null}
            metricKey="item-detail-menu-show"
            quantity={QUANTITY_UNKNOWN}
            size={SpinnerSize.Small}
            textPosition={SpinnerTextPosition.OverSpinner}
            outerContainerClassName={css.smartSpinner}
        />
    ) : (
        <EditDetailIcon />
    );
    return props.hasDetails ? (
        <div
            data-class="item-menu-button"
            data-item-id={props.itemId}
            data-item-type={props.itemType}
            className={buildClassName(css.itemDetailButton, props.className)}
            onClick={() => {
                if (!props.isLoading && props.onDetailClick) {
                    props.onDetailClick();
                }
            }}
        >
            {contentElts}
        </div>
    ) : null;
};
