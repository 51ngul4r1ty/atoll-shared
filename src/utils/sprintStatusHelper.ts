// consts/enums
import { SprintStatus } from "../components/molecules/cards/sprintCard/sprintCardTypes";

// interfaces/types
import { Sprint } from "../reducers/sprintsReducer";

// utils
import { roundDateToDayBoundary } from "./dateHelper";

export const determineSprintStatus = (sprint: Sprint): SprintStatus => {
    const currentTime = new Date().getTime();
    const afterSprintStart = currentTime >= roundDateToDayBoundary(sprint.startDate).getTime();
    const beforeSprintFinish = currentTime < roundDateToDayBoundary(sprint.finishDate).getTime();
    if (afterSprintStart && beforeSprintFinish) {
        return SprintStatus.InProgress;
    } else if (afterSprintStart) {
        // actually, this condition means "After Sprint Finish"
        return SprintStatus.Completed;
    } else {
        // and this condition means "Before Sprint Start"
        return SprintStatus.NotStarted;
    }
};
