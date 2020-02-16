// externals
import * as React from "react";

export interface ReviewViewStateProps {}

export interface ReviewViewDispatchProps {}

export interface ReviewViewProps {}

import css from "./InnerApp.module.css";
import { TopMenuPanel } from "./components/organisms/panels/TopMenuPanel";

export const ReviewView: React.FC<ReviewViewProps> = (props) => {
    return (
        <div className={css.app}>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
            <TopMenuPanel
                activeTabId="review"
                onChangeTab={(tabId: string) => {
                    // if (props.onChangeTab) {
                    //     props.onChangeTab(tabId);
                    // }
                }}
            />
        </div>
    );
};
