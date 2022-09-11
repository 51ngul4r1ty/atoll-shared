import * as ActionTypes from "./actionTypes";

export type ProjectPickerOpenedAction = {
    type: typeof ActionTypes.PROJECT_PICKER_OPENED;
};

export const projectPickerOpened = (): ProjectPickerOpenedAction => ({
    type: ActionTypes.PROJECT_PICKER_OPENED
});

export type ProjectPickerSwitchProjectAction = {
    type: typeof ActionTypes.SWITCH_PROJECT;
    payload: {
        projectId: string;
    };
};

export const switchProject = (projectId: string): ProjectPickerSwitchProjectAction => ({
    type: ActionTypes.SWITCH_PROJECT,
    payload: {
        projectId
    }
});
