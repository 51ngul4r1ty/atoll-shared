// externals
import * as React from "react";

// style
import css from "./BacklogItemRankView.module.css";

export enum RankItemType {
    None = 0,
    ListStart = 1, // item ID is null
    Middle = 2,
    ListEnd = 3, // next ID is null
    OrphanedListStart = 4, // item ID is not null
    OrphanedListEnd = 5, // next ID is not null,
    OrphanedListStartEnd = 6 // item ID is not null and next ID is not null
}

export interface BacklogItemRankItem {
    itemText: string;
    nextText: string;
    itemType: RankItemType;
    linkCount: number;
}

export interface BacklogItemRankGroup {
    items: BacklogItemRankItem[];
}

export interface BacklogItemRankViewStateProps {
    groups: BacklogItemRankGroup[];
}

export interface BacklogItemRankViewDispatchProps {
    onLoad: { () };
}

export type BacklogItemRankViewProps = BacklogItemRankViewStateProps & BacklogItemRankViewDispatchProps;

export const BacklogItemRankView: React.FC<BacklogItemRankViewProps> = (props) => {
    React.useEffect(() => {
        if (props.onLoad) {
            props.onLoad();
        }
    }, []);
    let groupIndex = 1;
    const buildGroupItemElts = (items: BacklogItemRankItem[]) => {
        let itemIndex = 1;
        return items.map((item) => (
            <div key={itemIndex++} className={css.row}>
                <div className={css.prevCell}>{item.itemText}</div>
                <div className={css.nextCell}>{item.nextText}</div>
            </div>
        ));
    };
    const itemElts = props.groups.map((group) => <div key={groupIndex++}>{buildGroupItemElts(group.items)}</div>);
    return (
        <>
            <h1>BACKLOG ITEM RANK DEBUG VIEWER</h1>
            {itemElts}
        </>
    );
};
