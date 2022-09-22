// externals
import { ReactNode } from "react";

// interfaces/types
import { DateOnly } from "../../../../types/dateTypes";

export type OnDateChange = (date: DateOnly) => void;

export type DatePickerBuilder = (
    startDate: DateOnly | null | undefined,
    finishDateToUse: DateOnly | null | undefined,
    pickingStartDate: boolean,
    onDateChange: OnDateChange
) => ReactNode;
