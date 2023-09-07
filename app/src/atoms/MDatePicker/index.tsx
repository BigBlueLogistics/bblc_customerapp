import { forwardRef } from "react";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import DatePicker from "react-datepicker";
import DatePickInputRoot from "./DatePickInputRoot";
import MDatePickerRoot from "./MDatePickerRoot";
import { TMDatePicker, TDatePick } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const DatePickInput = forwardRef<HTMLInputElement, TDatePick>(
  ({ value, onClick, label, inputStyle, variant }, ref) => {
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
  showTimeInput,
  selected,
  value,
  inputVariant = "standard",
  ...rest
}: TMDatePicker) {
  return (
    <MDatePickerRoot sx={containerStyle}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        isClearable
        showTimeInput={showTimeInput}
        timeInputLabel="Time:"
        dateFormat="MM/dd/yyyy h:mm aa"
        disabled={disabled}
        strictParsing
        name={name}
        customInput={
          <DatePickInput
            inputStyle={inputStyle}
            label={label}
            variant={inputVariant}
            value={value}
          />
        }
        {...rest}
      />
    </MDatePickerRoot>
  );
}

export default MDatePicker;
