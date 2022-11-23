import { useState } from "react";
import Icon from "@mui/material/Icon";
import DatePicker from "react-datepicker";
import DatePickInputRoot from "./DatePickInputRoot";
import MDateRangePickerRoot from "./MDateRangePickerRoot";
import { IMDateRangePicker, IDatePickInput } from "./types";
import "react-datepicker/dist/react-datepicker.css";

function DatePickInput({ value, onClick, label, buttonStyle, ...rest }: IDatePickInput) {
  return (
    <DatePickInputRoot
      {...rest}
      onClick={onClick}
      type="button"
      variant="contained"
      sx={buttonStyle}
    >
      {value || label}
      <Icon fontSize="large">date_range</Icon>
    </DatePickInputRoot>
  );
}

function MDateRangePicker({
  onChange,
  label,
  containerStyle,
  buttonStyle,
  disabled,
}: IMDateRangePicker) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeDate = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    onChange(dates);
  };

  return (
    <MDateRangePickerRoot sx={containerStyle}>
      <DatePicker
        selected={startDate}
        onChange={onChangeDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        isClearable
        minDate={startDate}
        disabled={disabled}
        customInput={<DatePickInput buttonStyle={buttonStyle} label={label} />}
      />
    </MDateRangePickerRoot>
  );
}

export default MDateRangePicker;
