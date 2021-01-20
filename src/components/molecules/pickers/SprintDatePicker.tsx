// externals
import React, { useEffect, useState } from "react";

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

const buildSprints = (startDate: Date, finishDate: Date) => {
    const editingSprint: CalendarSprintRange = {
        start: startDate,
        finish: finishDate,
        editing: true
    };
    return [editingSprint];
};

export const InnerSprintDatePicker: React.FC<SprintDatePickerProps & SprintDatePickerInnerStateProps> = (props) => {
    const [dateSelected, setDateSelected] = useState(
        props.pickerMode === SprintDatePickerMode.StartDate ? props.startDate : props.finishDate
    );
    const [startDate, setStartDate] = useState(props.startDate);
    const [finishDate, setFinishDate] = useState(props.finishDate);
    const [sprints, setSprints] = useState(buildSprints(props.startDate, props.finishDate));
    useEffect(() => {
        if (props.pickerMode === SprintDatePickerMode.StartDate) {
            setDateSelected(startDate);
        } else {
            setDateSelected(finishDate);
        }
    }, [props.pickerMode]);

    const handleDateChange = (date: Date) => {
        setDateSelected(date);
        if (props.pickerMode === SprintDatePickerMode.StartDate) {
            setStartDate(date);
            setSprints(buildSprints(date, finishDate));
        } else {
            setFinishDate(date);
            setSprints(buildSprints(startDate, date));
        }
    };

    const classNameToUse = buildClassName(props.className, css.outerPanel);
    return (
        <div className={classNameToUse}>
            <CalendarPanel
                sprints={sprints}
                dateSelected={dateSelected}
                onDateClick={(date) => {
                    handleDateChange(date);
                }}
            />
        </div>
    );
};

export const SprintDatePicker = (props: SprintDatePickerProps) => <InnerSprintDatePicker {...props} />;
