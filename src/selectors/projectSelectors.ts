// interfaces/types
import type { ProjectState } from "../reducers/project/projectReducer";

// state
import { StateTree } from "../reducers/rootReducer";

export const getProject = (state: StateTree): ProjectState => state.project;

export const getProjectId = (state: StateTree): string => getProject(state).id;
export const getProjectName = (state: StateTree): string => getProject(state).name;
export const getProjectDescription = (state: StateTree): string => getProject(state).description;
