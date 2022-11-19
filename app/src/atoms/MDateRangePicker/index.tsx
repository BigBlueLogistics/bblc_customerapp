import { useState } from "react";
import MDButton from "atoms/MDButton";
import MDBox from "atoms/MDBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./daterange.css";
import { IMDateRangePicker } from "./types";

function DatePickInput({ value, onClick, onChange, buttonStyle }: any) {
  return (
    <MDButton
      onChange={onChange}
      onClick={onClick}
      value={value}
      type="button"
      variant="contained"
      sx={buttonStyle}
    >
      {value}
    </MDButton>
  );
}

function MDateRangePicker({ onChange, containerStyle, buttonStyle }: IMDateRangePicker) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeDate = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    onChange(dates);
  };

  return (
    <MDBox sx={containerStyle}>
      <DatePicker
        selected={startDate}
        onChange={onChangeDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        isClearable
        minDate={startDate}
        customInput={<DatePickInput sx={buttonStyle} />}
      />
    </MDBox>
  );
}

export default MDateRangePicker;
