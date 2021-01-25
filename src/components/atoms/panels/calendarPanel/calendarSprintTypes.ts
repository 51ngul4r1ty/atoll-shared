// interfaces/types
import { DateOnly } from "../../../../types/dateTypes";

export interface CalendarSprintRange {
    start: DateOnly;
    finish: DateOnly;
    editing: boolean;
}
