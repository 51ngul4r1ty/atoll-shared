// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { push } from "connected-react-router";

// actions
import { setEditMode } from "../actions/appActions";

// state
import { StateTree } from "../types";

// components
import { TopMenuPanel } from "../components/organisms/panels/TopMenuPanel";

// consts/enums
import { EditMode } from "../components/molecules/buttons/EditButton";

// interfaces/types
import { TopMenuPanelStateProps, TopMenuPanelDispatchProps } from "../components/organisms/panels/TopMenuPanel";

export interface TopMenuPanelContainerProps {
    activeTabId: string;
}

const mapStateToProps = (state: StateTree, ownProps: TopMenuPanelContainerProps): TopMenuPanelStateProps => {
    let result: TopMenuPanelStateProps = {
        activeTabId: ownProps.activeTabId,
        editMode: state.app.editMode
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): TopMenuPanelDispatchProps => {
    return {
        onChangeTab: (tabId: string) => {
            switch (tabId) {
                case "plan":
                    dispatch(push("/plan"));
                    break;
                case "sprint":
                    dispatch(push("/sprint"));
                    break;
                case "review":
                    dispatch(push("/review"));
                    break;
            }
        },
        setEditMode: (editMode: EditMode) => {
            dispatch(setEditMode(editMode));
        }
    };
};

export const TopMenuPanelContainer = connect(mapStateToProps, mapDispatchToProps)(TopMenuPanel);
