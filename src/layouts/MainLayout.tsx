// externals
import * as React from "react";

// style
import css from "./MainLayout.module.css";

/* executed on initialization only */

/* exported component */

export class MainLayout extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={`app-layout ${css.fullPage}`}>{this.props.children}</div>;
    }
}
