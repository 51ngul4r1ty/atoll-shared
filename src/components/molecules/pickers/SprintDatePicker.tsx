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

export interface SprintDatePickerDispatchProps {
    onStartDateChange?: { (newStartDate: Date) };
    onFinishDateChange?: { (newFinishDate: Date) };
}

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

const handleDateChangeInSingleDateModes = (
    date: Date,
    pickerMode: SprintDatePickerMode,
    finishDate: Date,
    startDate: Date,
    setDateSelected: React.Dispatch<React.SetStateAction<Date>>,
    setStartDate: React.Dispatch<React.SetStateAction<Date>>,
    setSprints: React.Dispatch<React.SetStateAction<CalendarSprintRange[]>>,
    setFinishDate: React.Dispatch<React.SetStateAction<Date>>,
    onStartDateChanged: { (date: Date) },
    onFinishDateChanged: { (date: Date) }
) => {
    setDateSelected(date);
    switch (pickerMode) {
        case SprintDatePickerMode.StartDate: {
            setStartDate(date);
            setSprints(buildSprints(date, finishDate));
            if (onStartDateChanged) {
                onStartDateChanged(date);
            }
            break;
        }
        case SprintDatePickerMode.FinishDate: {
            setFinishDate(date);
            setSprints(buildSprints(startDate, date));
            if (onFinishDateChanged) {
                onFinishDateChanged(date);
            }
            break;
        }
    }
};

const handleDateChangeInDateRangeMode = (
    startDate: Date,
    finishDate: Date,
    date: Date,
    pickerMode: SprintDatePickerMode,
    setStartDate: React.Dispatch<React.SetStateAction<Date>>,
    setFinishDate: React.Dispatch<React.SetStateAction<Date>>,
    setPickerMode: React.Dispatch<React.SetStateAction<SprintDatePickerMode>>,
    setDateSelected: React.Dispatch<React.SetStateAction<Date>>,
    setSprints: React.Dispatch<React.SetStateAction<CalendarSprintRange[]>>,
    onStartDateChanged: { (date: Date) },
    onFinishDateChanged: { (date: Date) }
) => {
    if (!startDate && !finishDate) {
        const newFinishDate = addDays(date, 13);
        setStartDate(date);
        setFinishDate(newFinishDate);
        setPickerMode(SprintDatePickerMode.FinishDate);
        setDateSelected(date);
        setSprints(buildSprints(date, newFinishDate));
        onFinishDateChanged(newFinishDate);
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
            onFinishDateChanged(date);
        } else {
            setStartDate(date);
            setDateSelected(date);
            setSprints(buildSprints(date, finishDate));
            onStartDateChanged(date);
        }
    } else if (pickerMode === SprintDatePickerMode.FinishDate) {
        if (daySequenceIs(date, startDate)) {
            setStartDate(date);
            setDateSelected(date);
            setSprints(buildSprints(date, finishDate));
            setPickerMode(SprintDatePickerMode.StartDate);
            onStartDateChanged(date);
        } else {
            setFinishDate(date);
            setDateSelected(date);
            setSprints(buildSprints(startDate, date));
            onFinishDateChanged(date);
        }
    }
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
    const updateSprints = () => {
        setSprints(buildSprints(props.startDate, props.finishDate));
    };
    useEffect(() => {
        setStartDate(props.startDate);
        updateSprints();
    }, [props.startDate]);
    useEffect(() => {
        setStartDate(props.finishDate);
        updateSprints();
    }, [props.finishDate]);
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
            handleDateChangeInDateRangeMode(
                startDate,
                finishDate,
                date,
                pickerMode,
                setStartDate,
                setFinishDate,
                setPickerMode,
                setDateSelected,
                setSprints,
                props.onStartDateChange,
                props.onFinishDateChange
            );
        } else {
            handleDateChangeInSingleDateModes(
                date,
                pickerMode,
                finishDate,
                startDate,
                setDateSelected,
                setStartDate,
                setSprints,
                setFinishDate,
                props.onStartDateChange,
                props.onFinishDateChange
            );
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
