import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { IAutoCompleteExpiryData, IAutoCompleteExpiry } from "./types";

function AutoCompleteExpiry({
  options,
  value,
  index,
  error,
  helperText,
  onChange,
}: IAutoCompleteExpiry) {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: IAutoCompleteExpiryData) => option.expiry + option.batch,
  });

  return (
    <Autocomplete
      id={`${index}-filter-expiry`}
      value={value as any}
      onChange={(e, selectedValue, reason) => onChange(selectedValue as any, reason)}
      options={options}
      noOptionsText="No expiry/batch"
      filterOptions={filterOptions}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return option.id.toString();
      }}
      sx={{ width: 250 }}
      renderInput={(params) => (
        <TextField {...params} error={error} helperText={helperText} label="Select expiry" />
      )}
      renderOption={(props, option) => {
        return (
          <li key={option.id} {...props} style={{ display: "block" }}>
            <div>{option.expiry}</div>
            <small>{option.batch}</small>
          </li>
        );
      }}
    />
  );
}

export default AutoCompleteExpiry;
