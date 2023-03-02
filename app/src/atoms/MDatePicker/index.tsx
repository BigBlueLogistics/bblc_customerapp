import { useState, forwardRef } from "react";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import DatePicker from "react-datepicker";
import DatePickInputRoot from "./DatePickInputRoot";
import MDatePickerRoot from "./MDatePickerRoot";
import { IMDatePicker, IDatePick } from "./types";
import "react-datepicker/dist/react-datepicker.css";

const DatePickInput = forwardRef<HTMLInputElement, IDatePick>(
  ({ value, onClick, label, inputStyle, variant, ...rest }, ref) => {
    return (
      <DatePickInputRoot
        type="text"
        variant={variant}
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

function MDatePicker({
  onChange,
  name,
  label,
  containerStyle,
  inputStyle,
  disabled,
  defaultValue = null,
  inputVariant = "standard",
  ...rest
}: IMDatePicker) {
  const [selectedDate, setSelectedDate] = useState(defaultValue);

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
        name={name}
        customInput={<DatePickInput inputStyle={inputStyle} label={label} variant={inputVariant} />}
        {...rest}
      />
    </MDatePickerRoot>
  );
}

export default MDatePicker;
