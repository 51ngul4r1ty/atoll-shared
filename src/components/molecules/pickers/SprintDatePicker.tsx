// externals
import React, { useEffect, useState } from "react";

// style
import css from "./SprintDatePicker.module.css";

// components
import { CalendarPanel } from "../../atoms/panels/calendarPanel/CalendarPanel";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { CalendarSprintRange } from "../../atoms/panels/calendarPanel/calendarSprintTypes";

// utils
import { buildClassName } from "../../../utils";
import { DateOnly } from "../../../types/dateTypes";

export enum SprintDatePickerMode {
    StartDate = 1,
    FinishDate = 2,
    DateRange = 3
}

export interface SprintDatePickerStateProps extends PropsWithClassName {
    startDate?: DateOnly | null;
    finishDate?: DateOnly | null;
    pickerMode: SprintDatePickerMode;
    suppressPadding?: boolean;
}

export interface SprintDatePickerDispatchProps {
    onStartDateChange?: { (newStartDate: DateOnly) };
    onFinishDateChange?: { (newFinishDate: DateOnly) };
}

export type SprintDatePickerProps = SprintDatePickerStateProps & SprintDatePickerDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface SprintDatePickerInnerStateProps {}

const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const buildSprints = (startDate: DateOnly, finishDate: DateOnly) => {
    const editingSprint: CalendarSprintRange = {
        start: startDate,
        finish: finishDate,
        editing: true
    };
    return [editingSprint];
};

const handleDateChangeInSingleDateModes = (
    date: DateOnly,
    pickerMode: SprintDatePickerMode,
    finishDate: DateOnly,
    startDate: DateOnly,
    setDateSelected: React.Dispatch<React.SetStateAction<DateOnly>>,
    setStartDate: React.Dispatch<React.SetStateAction<DateOnly>>,
    setSprints: React.Dispatch<React.SetStateAction<CalendarSprintRange[]>>,
    setFinishDate: React.Dispatch<React.SetStateAction<DateOnly>>,
    onStartDateChanged: { (date: DateOnly) },
    onFinishDateChanged: { (date: DateOnly) }
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
    startDate: DateOnly,
    finishDate: DateOnly,
    date: DateOnly,
    pickerMode: SprintDatePickerMode,
    setStartDate: React.Dispatch<React.SetStateAction<DateOnly>>,
    setFinishDate: React.Dispatch<React.SetStateAction<DateOnly>>,
    setPickerMode: React.Dispatch<React.SetStateAction<SprintDatePickerMode>>,
    setDateSelected: React.Dispatch<React.SetStateAction<DateOnly>>,
    setSprints: React.Dispatch<React.SetStateAction<CalendarSprintRange[]>>,
    onStartDateChanged: { (date: DateOnly) },
    onFinishDateChanged: { (date: DateOnly) }
) => {
    if (!startDate && !finishDate) {
        // TODO: Make this configurable (create a story for this)
        const newFinishDate = date.addDays(13);
        setStartDate(date);
        setFinishDate(newFinishDate);
        setPickerMode(SprintDatePickerMode.FinishDate);
        setDateSelected(date);
        setSprints(buildSprints(date, newFinishDate));
        onFinishDateChanged(newFinishDate);
    } else if (date.eq(startDate)) {
        if (date.eq(finishDate)) {
            setDateSelected(date);
            setPickerMode(SprintDatePickerMode.FinishDate);
        } else {
            setDateSelected(date);
            setPickerMode(SprintDatePickerMode.StartDate);
        }
    } else if (date.eq(finishDate)) {
        setDateSelected(date);
        setPickerMode(SprintDatePickerMode.FinishDate);
    } else if (pickerMode === SprintDatePickerMode.StartDate) {
        if (date.gte(finishDate)) {
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
        if (startDate.eq(date)) {
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

    const handleDateChange = (date: DateOnly) => {
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
