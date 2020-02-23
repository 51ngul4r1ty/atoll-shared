// externals
import * as React from "react";

// components
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

// style
import css from "./App.module.css";

export interface ReviewViewStateProps {}

export interface ReviewViewDispatchProps {}

export interface ReviewViewProps {
    editMode: EditMode;
}

export const ReviewView: React.FC<ReviewViewProps> = (props) => {
    return (
        <>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
            <TopMenuPanelContainer activeTabId="review" />
        </>
    );
};
