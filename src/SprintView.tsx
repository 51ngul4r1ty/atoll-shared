// externals
import * as React from "react";

export interface SprintViewStateProps {}

export interface SprintViewDispatchProps {}

export interface SprintViewProps {}

import css from "./InnerApp.module.css";
import { TopMenuPanel } from "./components/organisms/panels/TopMenuPanel";

export const SprintView: React.FC<SprintViewProps> = (props) => {
    return (
        <div className={css.app}>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll � %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
            <TopMenuPanel
                activeTabId="sprint"
                onChangeTab={(tabId: string) => {
                    // if (props.onChangeTab) {
                    //     props.onChangeTab(tabId);
                    // }
                }}
            />
        </div>
    );
};
