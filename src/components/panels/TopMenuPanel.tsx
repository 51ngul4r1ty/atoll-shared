// externals
import * as React from "react";

// components
import { HomeButton } from "../buttons/HomeButton";
import { TabStrip } from "../tabs/TabStrip";
import css from "./TopMenuPanel.module.css";

/* exported interfaces */

export interface TopMenuPanelAttributeProps {
    activeTabId?: string;
}

export interface TopMenuPanelEventProps {
    onChangeTab?: { (selectedTabId: string) };
}

export type TopMenuPanelProps = TopMenuPanelAttributeProps & TopMenuPanelEventProps;

/* exported components */

export const TopMenuPanel: React.FC<TopMenuPanelProps> = (props) => (
    <div className={css.topMenuPanel}>
        <HomeButton />
        <TabStrip
            activeTab={(props && props.activeTabId) || "plan"}
            tabs={[{ id: "plan", caption: "Plan" }, { id: "sprint", caption: "Sprint" }, { id: "review", caption: "Review" }]}
            onChange={(tabId) => {
                if (props && props.onChangeTab) {
                    props.onChangeTab(tabId);
                }
            }}
        />
    </div>
);
