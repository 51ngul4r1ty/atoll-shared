// consts/enums
import { SprintStatus } from "../components/molecules/cards/sprintCard/sprintCardTypes";

// utils
import { timeNow, roundDateToDayBoundary } from "./dateHelper";

export const determineSprintExpanded = (startDate: Date, finishDate: Date): boolean => {
    const status = determineSprintStatus(startDate, finishDate);
    return status === SprintStatus.NotStarted;
};

export const determineSprintStatus = (startDate: Date, finishDate: Date): SprintStatus => {
    const currentTime = timeNow().getTime();
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
