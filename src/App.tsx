// externals
import * as React from "react";

// components/containers
import InnerAppContainer from "./InnerAppContainer";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported component */

export class App extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <InnerAppContainer />
            </div>
        );
    }
}
