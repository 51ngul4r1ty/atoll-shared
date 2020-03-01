// externals
import * as React from "react";

// style
import css from "./TabStrip.module.css";
import { buildClassName } from "../../../utils/classNameBuilder";

/* exported interfaces/types */

export interface Tab {
    id: string;
    caption: string;
}

export interface TabStripStateProps {
    activeTab: string;
    tabs: Tab[];
}

export interface TabStripDispatchProps {
    onChange?: { (tabId: string) };
}

export type TabStripProps = TabStripStateProps & TabStripDispatchProps;

/* exported components */

export const TabStrip: React.FC<TabStripProps> = (props) => {
    let idx = 1;
    const handleTabClick = (tabId: string) => {
        if (props.onChange) {
            props.onChange(tabId);
        }
    };
    const tabs = props.tabs.map((tab) => {
        const className = buildClassName(css.tab, tab.id === props.activeTab ? css.active : "");
        idx++;
        return (
            <div
                key={`tab-${idx}`}
                className={className}
                tabIndex={0}
                onClick={() => {
                    handleTabClick(tab.id);
                }}
            >
                {tab.caption}
            </div>
        );
    });
    return <div className={css.tabs}>{tabs}</div>;
};
