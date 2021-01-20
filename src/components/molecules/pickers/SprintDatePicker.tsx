// externals
import React from "react";

// style
import css from "./SprintDatePicker.module.css";

// components
import { CalendarPanel } from "../../atoms";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { buildClassName } from "../../../utils";
import { CalendarSprintRange } from "../../atoms/panels/calendarPanel/calendarSprintTypes";

export enum SprintDatePickerMode {
    StartDate = 1,
    FinishDate = 2
}

export interface SprintDatePickerStateProps extends PropsWithClassName {
    startDate?: Date | null;
    finishDate?: Date | null;
    pickerMode: SprintDatePickerMode;
}

export interface SprintDatePickerDispatchProps {}

export type SprintDatePickerProps = SprintDatePickerStateProps & SprintDatePickerDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface SprintDatePickerInnerStateProps {}

const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const InnerSprintDatePicker: React.FC<SprintDatePickerProps & SprintDatePickerInnerStateProps> = (props) => {
    const classNameToUse = buildClassName(props.className, css.outerPanel);
    const sprints: CalendarSprintRange[] = [
        {
            start: props.startDate,
            finish: props.finishDate,
            editing: true
        }
    ];
    const dateSelected = props.pickerMode === SprintDatePickerMode.StartDate ? props.startDate : props.finishDate;
    return (
        <div className={classNameToUse}>
            <CalendarPanel sprints={sprints} dateSelected={dateSelected} />
        </div>
    );
};

export const SprintDatePicker = (props: SprintDatePickerProps) => <InnerSprintDatePicker {...props} />;
