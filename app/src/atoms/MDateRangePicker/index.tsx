import { useState, forwardRef } from "react";
import Icon from "@mui/material/Icon";
import DatePicker from "react-datepicker";
import DatePickButtonRoot from "./DatePickButtonRoot";
import MDateRangePickerRoot from "./MDateRangePickerRoot";
import { TMDateRangePicker, TMDatePicker } from "./types";
import "react-datepicker/dist/react-datepicker.css";

const DatePickButton = forwardRef<HTMLButtonElement, TMDatePicker>(
  ({ value, onClick, label, buttonStyle, ...rest }, ref) => {
    return (
      <DatePickButtonRoot
        ref={ref}
        onClick={onClick}
        type="button"
        variant="contained"
        sx={buttonStyle}
        {...rest}
      >
        {value || label}
        <Icon fontSize="large">date_range</Icon>
      </DatePickButtonRoot>
    );
  }
);

DatePickButton.displayName = "DatePickButton";

function MDateRangePicker({
  onChange,
  label,
  sx,
  buttonStyle,
  disabled,
  ...rest
}: TMDateRangePicker) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeDate = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    onChange(dates);
  };

  return (
    <MDateRangePickerRoot sx={sx}>
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
        customInput={<DatePickButton buttonStyle={buttonStyle} label={label} />}
        {...rest}
      />
    </MDateRangePickerRoot>
  );
}

export default MDateRangePicker;
