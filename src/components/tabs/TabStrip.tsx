// externals
import * as React from "react";

// style
import css from "./TabStrip.module.css";

/* exported interfaces/types */

export interface Tab {
    id: string;
    caption: string;
}

export interface TabStripAttributeProps {
    activeTab: string;
    tabs: Tab[];
}

export interface TabStripEventProps {
    onChange?: { (tabId: string) };
}

export type TabStripProps = TabStripAttributeProps & TabStripEventProps;

/* exported components */

export const TabStrip: React.FC<TabStripProps> = (props) => {
    let tabIndex = 1;
    const handleTabClick = (tabId: string) => {
        if (props.onChange) {
            props.onChange(tabId);
        }
    };
    const tabs = props.tabs.map((tab) => {
        const className = css.tab + (tab.id === props.activeTab ? ` ${css.active}` : "");
        return (
            <div
                key={`tab-${tabIndex++}`}
                className={className}
                onClick={() => {
                    handleTabClick(tab.id);
                }}
            >
                {tab.caption}
            </div>
        );
    });
    return (
        <div className={css.tabs} tabIndex={0}>
            {tabs}
        </div>
    );
};
