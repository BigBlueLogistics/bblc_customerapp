import { useState, forwardRef } from "react";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import DatePicker from "react-datepicker";
import DatePickInputRoot from "./DatePickInputRoot";
import MDatePickerRoot from "./MDatePickerRoot";
import { IMDatePicker, IDatePick } from "./types";
import "react-datepicker/dist/react-datepicker.css";

const DatePickInput = forwardRef<HTMLInputElement, IDatePick>(
  ({ value, onClick, label, inputStyle, ...rest }, ref) => {
    return (
      <DatePickInputRoot
        type="text"
        variant="standard"
        ref={ref}
        onClick={onClick}
        sx={inputStyle}
        value={value}
        label={label}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ visibility: value ? "hidden" : "visible" }}>
              <Icon fontSize="small">date_range</Icon>
            </InputAdornment>
          ),
        }}
        {...rest}
      />
    );
  }
);
DatePickInput.displayName = "DatePickInput";

function MDateRangePicker({ onChange, label, containerStyle, inputStyle, disabled }: IMDatePicker) {
  const [selectedDate, setSelectedDate] = useState(null);

  const onChangeDate = (date: Date) => {
    setSelectedDate(date);

    onChange(date);
  };

  return (
    <MDatePickerRoot sx={containerStyle}>
      <DatePicker
        selected={selectedDate}
        onChange={onChangeDate}
        isClearable
        showTimeInput
        timeInputLabel="Time:"
        dateFormat="MM/dd/yyyy h:mm aa"
        disabled={disabled}
        strictParsing
        customInput={<DatePickInput inputStyle={inputStyle} label={label} />}
      />
    </MDatePickerRoot>
  );
}

export default MDateRangePicker;