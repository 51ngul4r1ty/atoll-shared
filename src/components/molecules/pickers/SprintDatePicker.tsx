// externals
import React, { useEffect, useState } from "react";

// style
import css from "./SprintDatePicker.module.css";

// components
import { CalendarPanel } from "../../atoms";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { CalendarSprintRange } from "../../atoms/panels/calendarPanel/calendarSprintTypes";

// utils
import { addDays, buildClassName, daySequenceIs, sameDay } from "../../../utils";

export enum SprintDatePickerMode {
    StartDate = 1,
    FinishDate = 2,
    DateRange = 3
}

export interface SprintDatePickerStateProps extends PropsWithClassName {
    startDate?: Date | null;
    finishDate?: Date | null;
    pickerMode: SprintDatePickerMode;
    suppressPadding?: boolean;
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
    const [pickerMode, setPickerMode] = useState<SprintDatePickerMode>(
        props.pickerMode === SprintDatePickerMode.DateRange ? SprintDatePickerMode.StartDate : props.pickerMode
    );
    const [startDate, setStartDate] = useState(props.startDate);
    const [finishDate, setFinishDate] = useState(props.finishDate);
    const [sprints, setSprints] = useState(buildSprints(props.startDate, props.finishDate));
    useEffect(() => {
        switch (props.pickerMode) {
            case SprintDatePickerMode.StartDate: {
                setDateSelected(startDate);
                setPickerMode(props.pickerMode);
                break;
            }
            case SprintDatePickerMode.FinishDate: {
                setDateSelected(finishDate);
                setPickerMode(props.pickerMode);
                break;
            }
        }
    }, [props.pickerMode]);

    const handleDateChange = (date: Date) => {
        if (props.pickerMode === SprintDatePickerMode.DateRange) {
            // Rules:
            //   1. If nothing selected, it will set start to first click
            //      and finish to 13 days later (2 week sprint).
            //   2. If range available, mode has been set to "select start"
            //      and first click will change the start.
            //   3. Mode will stay as "select start" until the end date is
            //      clicked and then it will switch to "select finish" mode.
            //   4. Mode will stay as "select finish" until the start date is
            //      clicked.
            //   5. If start and finish date is the same it is in "select finish"
            //      mode.
            //   6. If in "select start" mode and date after finish is selected
            //      then it should assume user intended to pick finish date and
            //      set that and switch over to "select finish" mode.
            //   7. If in "select finish" mode and date before start is selected
            //      then it should assume user intended to pick start date and
            //      set that and switch over to "select start" mode.
            if (!startDate && !finishDate) {
                const newFinishDate = addDays(date, 13);
                setStartDate(date);
                setFinishDate(newFinishDate);
                setPickerMode(SprintDatePickerMode.FinishDate);
                setDateSelected(date);
                setSprints(buildSprints(date, newFinishDate));
            } else if (sameDay(date, startDate)) {
                if (sameDay(date, finishDate)) {
                    setDateSelected(date);
                    setPickerMode(SprintDatePickerMode.FinishDate);
                } else {
                    setDateSelected(date);
                    setPickerMode(SprintDatePickerMode.StartDate);
                }
            } else if (sameDay(date, finishDate)) {
                setDateSelected(date);
                setPickerMode(SprintDatePickerMode.FinishDate);
            } else if (pickerMode === SprintDatePickerMode.StartDate) {
                if (daySequenceIs(finishDate, date)) {
                    setFinishDate(date);
                    setDateSelected(date);
                    setSprints(buildSprints(startDate, date));
                    setPickerMode(SprintDatePickerMode.FinishDate);
                } else {
                    setStartDate(date);
                    setDateSelected(date);
                    setSprints(buildSprints(date, finishDate));
                }
            } else if (pickerMode === SprintDatePickerMode.FinishDate) {
                if (daySequenceIs(date, startDate)) {
                    setStartDate(date);
                    setDateSelected(date);
                    setSprints(buildSprints(date, finishDate));
                    setPickerMode(SprintDatePickerMode.StartDate);
                } else {
                    setFinishDate(date);
                    setDateSelected(date);
                    setSprints(buildSprints(startDate, date));
                }
            }
        } else {
            setDateSelected(date);
            switch (pickerMode) {
                case SprintDatePickerMode.StartDate: {
                    setStartDate(date);
                    setSprints(buildSprints(date, finishDate));
                    break;
                }
                case SprintDatePickerMode.FinishDate: {
                    setFinishDate(date);
                    setSprints(buildSprints(startDate, date));
                    break;
                }
            }
        }
    };

    const classNameToUse = buildClassName(props.className, css.outerPanel, props.suppressPadding ? css.suppressPadding : null);
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
