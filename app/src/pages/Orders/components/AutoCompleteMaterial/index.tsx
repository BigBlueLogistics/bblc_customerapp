import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { IAutoCompleteMaterialData, IAutoCompleteMaterial } from "./types";

function AutoCompleteMaterial({ options, value, index, onChange }: IAutoCompleteMaterial) {
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
        return option.id.toString();
      }}
      sx={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Select material" />}
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
