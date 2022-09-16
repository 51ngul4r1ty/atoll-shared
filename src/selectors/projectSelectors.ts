// externals
import { createSelector } from "reselect";

// interfaces/types
import type { ProjectState } from "../reducers/project/projectReducer";
import { Project } from "../reducers/project/projectReducerTypes";

// state
import { StateTree } from "../reducers/rootReducer";

const project = (state: StateTree): ProjectState => state.project;

export const getProjectId = createSelector([project], (project: ProjectState): string => project.id);
export const getProjectName = createSelector([project], (project: ProjectState): string => project.name);
export const getProjectDescription = createSelector([project], (project: ProjectState): string => project.description);

export const getProjectItems = createSelector([project], (project: ProjectState): Project[] => project.projects);

export const isProjectItemsLoading = createSelector([project], (project: ProjectState): boolean => !project.projectsLoaded);

export const selectProjectPickerOpen = createSelector([project], (project: ProjectState): boolean => project.projectPickerOpen);
