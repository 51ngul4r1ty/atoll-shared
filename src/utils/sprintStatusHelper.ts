// consts/enums
import { SprintStatus } from "../components/molecules/cards/sprintCard/sprintCardTypes";
import { DateOnly } from "../types/dateTypes";

export const determineSprintStatus = (startDate: DateOnly, finishDate: DateOnly): SprintStatus => {
    const currentDate = new DateOnly();
    const afterSprintStart = currentDate.gte(startDate);
    const beforeSprintFinish = currentDate.lte(finishDate);
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
