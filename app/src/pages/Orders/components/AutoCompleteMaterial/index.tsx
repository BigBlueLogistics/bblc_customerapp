import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { IAutoCompleteMaterialData, IAutoCompleteMaterial } from "./types";

function AutoCompleteMaterial({
  options,
  value,
  index,
  error,
  helperText,
  optionsDisabled,
  onChange,
}: IAutoCompleteMaterial) {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: IAutoCompleteMaterialData) => option.material + option.description,
  });

  return (
    <Autocomplete
      id={`${index}-filter-material`}
      value={value as any}
      onChange={(e, selectedValue, reason) => onChange(selectedValue as any, reason)}
      options={options}
      noOptionsText="No material"
      filterOptions={filterOptions}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return option.material;
      }}
      getOptionDisabled={(option) => {
        return optionsDisabled.includes(option.material);
      }}
      sx={{ width: 250 }}
      renderInput={(params) => (
        <TextField error={error} helperText={helperText} {...params} label="Select material" />
      )}
      renderOption={(props, option) => {
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
