import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { IAutoCompleteUnitsData, IAutoCompleteUnits } from "./types";

function AutoCompleteUnits({
  options,
  value,
  index,
  error,
  helperText,
  // optionsDisabled,
  onChange,
}: IAutoCompleteUnits) {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: IAutoCompleteUnitsData) => option,
  });

  return (
    <Autocomplete
      id={`${index}-filter-units`}
      value={value as any}
      onChange={(e, selectedValue, reason) => onChange(selectedValue as any, reason)}
      options={options}
      noOptionsText="No units"
      filterOptions={filterOptions}
      // getOptionDisabled={(option) => {
      //   return optionsDisabled.includes(option);
      // }}
      sx={{ width: 150 }}
      renderInput={(params) => (
        <TextField error={error} helperText={helperText} {...params} label="Select unit" />
      )}
    />
  );
}

export default AutoCompleteUnits;
