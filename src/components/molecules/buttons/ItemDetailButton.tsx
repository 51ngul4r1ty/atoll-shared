// externals
import * as React from "react";

// consts/enums
import { SpinnerAction, SpinnerSize, SpinnerTextPosition } from "../unique/smartSpinner/smartSpinnerEnums";
import { QUANTITY_UNKNOWN, TIME_UNKNOWN } from "../unique/smartSpinner/smartSpinnerConsts";

// components
import { EditDetailIcon } from "../../atoms/icons/EditDetailIcon";
import { SmartSpinner } from "../unique/smartSpinner/SmartSpinner";

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
