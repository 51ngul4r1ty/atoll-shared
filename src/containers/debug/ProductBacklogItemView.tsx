// externals
import * as React from "react";

// style
import css from "./ProductBacklogItemView.module.css";

export enum RankItemType {
    None = 0,
    ListStart = 1, // item ID is null
    Middle = 2,
    ListEnd = 3, // next ID is null
    OrphanedListStart = 4, // item ID is not null
    OrphanedListEnd = 5, // next ID is not null,
    OrphanedListStartEnd = 6 // item ID is not null and next ID is not null
}

export interface ProductBacklogItemItem {
    itemText: string;
    nextText: string;
    itemType: RankItemType;
    linkCount: number;
}

export interface ProductBacklogItemGroup {
    items: ProductBacklogItemItem[];
}

export interface ProductBacklogItemViewStateProps {
    groups: ProductBacklogItemGroup[];
    error: any;
}

export interface ProductBacklogItemViewDispatchProps {
    onLoad: { () };
}

export type ProductBacklogItemViewProps = ProductBacklogItemViewStateProps & ProductBacklogItemViewDispatchProps;

export const ProductBacklogItemView: React.FC<ProductBacklogItemViewProps> = (props) => {
    React.useEffect(() => {
        if (props.onLoad) {
            props.onLoad();
        }
    }, []);
    let groupIndex = 1;
    const buildGroupItemElts = (items: ProductBacklogItemItem[]) => {
        let itemIndex = 1;
        return items.map((item) => (
            <div key={itemIndex++} className={css.row}>
                <div className={css.prevCell}>{item.itemText}</div>
                <div className={css.nextCell}>{item.nextText}</div>
            </div>
        ));
    };
    const itemElts = props.groups.map((group) => <div key={groupIndex++}>{buildGroupItemElts(group.items)}</div>);
    const errorMessage = props.error ? <span>ERRORS ENCOUNTERED: {`${props.error}`}</span> : null;
    return (
        <div className={css.content}>
            <h1>BACKLOG ITEM RANK DEBUG VIEWER</h1>
            {itemElts}
            {errorMessage}
        </div>
    );
};
