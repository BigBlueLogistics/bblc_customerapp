import { TextField, createFilterOptions, Autocomplete } from "@mui/material";
import { IAutoCompleteMaterialData, IAutoCompleteMaterial } from "./types";

function AutoCompleteMaterial({
  options,
  value,
  error,
  helperText,
  onChange,
  sx,
}: IAutoCompleteMaterial) {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: IAutoCompleteMaterialData) => option.material + option.description,
  });

  return (
    <Autocomplete
      id="movements-filter-material"
      value={value as any}
      onChange={(e, selectedValue, reason) => onChange(selectedValue as any, reason)}
      options={options}
      noOptionsText="No material"
      filterOptions={filterOptions}
      getOptionLabel={(option: IAutoCompleteMaterialData) => {
        if (typeof option === "string") {
          return option;
        }
        return option.material;
      }}
      sx={sx}
      renderInput={(params) => (
        <TextField
          error={error}
          helperText={helperText}
          sx={({ palette }) => ({
            "& .MuiInputBase-root": {
              minWidth: "200px",
              height: "42px",
              backgroundColor: palette.searchFilter.input.main,
              "& .MuiAutocomplete-input": {
                padding: "2px 4px",
              },
            },
          })}
          {...params}
          label="Select material"
        />
      )}
      renderOption={(props, option: IAutoCompleteMaterialData) => {
        return (
          <li key={option.id} {...props} style={{ display: "block" }}>
            <div>{option.material}</div>
            <small>{option.description}</small>
          </li>
        );
      }}
    />
  );
}

export default AutoCompleteMaterial;
