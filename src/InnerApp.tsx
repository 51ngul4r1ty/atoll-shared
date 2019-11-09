// externals
import * as React from "react";
import Helmet from "react-helmet";

// libraries
import { themeList } from "./themes/all";

// components
import { TopMenuPanel } from "./components/panels/TopMenuPanel";

// style
import css from "./InnerApp.module.css";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface InnerAppAttributeProps {}

export interface InnerAppEventProps {}

export type InnerAppProps = InnerAppAttributeProps & InnerAppEventProps;

/* exported component */

export class InnerApp extends React.Component<InnerAppProps, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        const topMenuPanel = <TopMenuPanel />;
        return (
            <div className={css.app}>
                {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                {topMenuPanel}
            </div>
        );
    }
}
