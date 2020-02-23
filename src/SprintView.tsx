// externals
import * as React from "react";

// components
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

// style
import css from "./App.module.css";

export interface SprintViewStateProps {
    editMode: EditMode;
}

export interface SprintViewDispatchProps {}

export type SprintViewProps = SprintViewStateProps & SprintViewDispatchProps;

export const SprintView: React.FC<SprintViewProps> = (props) => {
    return (
        <div className={css.app}>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll � %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
            <TopMenuPanelContainer activeTabId="sprint" />
        </div>
    );
};
