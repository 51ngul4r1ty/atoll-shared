// consts/enums
import { SprintStatus } from "../components/molecules/cards/sprintCard/sprintCardTypes";

// interfaces/types
import { Sprint } from "../reducers/sprintsReducer";

// utils
import { roundDateToDayBoundary } from "./dateHelper";

export const determineSprintStatus = (startDate: Date, finishDate: Date): SprintStatus => {
    const currentTime = new Date().getTime();
    const afterSprintStart = currentTime >= roundDateToDayBoundary(startDate).getTime();
    const beforeSprintFinish = currentTime < roundDateToDayBoundary(finishDate).getTime();
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
