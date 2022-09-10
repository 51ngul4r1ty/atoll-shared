// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// state
import type { StateTree } from "../reducers/rootReducer";

// components
import { BottomPanel } from "../components/organisms/panels/BottomPanel";

// interfaces/types
import { BottomPanelStateProps, BottomPanelDispatchProps } from "../components/organisms/panels/BottomPanel";

// selectors
import * as projectSelectors from "../selectors/projectSelectors";

// actions
import { projectPickerOpened, switchProject } from "../actions/projectActions";

export type BottomPanelContainerProps = {};

const mapStateToProps = (state: StateTree, ownProps: BottomPanelContainerProps): BottomPanelStateProps => {
    let result: BottomPanelStateProps = {
        projectPickerOpen: false, // TODO: Finish this?
        projectName: projectSelectors.getProjectName(state),
        projectDescription: projectSelectors.getProjectDescription(state),
        projectItemsLoading: projectSelectors.isProjectItemsLoading(state),
        projects: projectSelectors.getProjectItems(state)
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BottomPanelDispatchProps => {
    return {
        onMenuOpened: () => {
            dispatch(projectPickerOpened());
        },
        onProjectItemClicked: (itemId: string) => {
            dispatch(switchProject(itemId));
        }
    };
};

export const BottomPanelContainer = connect(mapStateToProps, mapDispatchToProps)(BottomPanel);
