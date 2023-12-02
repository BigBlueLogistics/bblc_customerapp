import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import MDInput from "atoms/MDInput";
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
      clearOnBlur
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
      sx={{ width: 155 }}
      renderInput={(params) => (
        <MDInput
          {...params}
          error={error}
          helperText={helperText}
          label="Select expiry"
          variant="standard"
          endAdornment={false}
        />
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
