import MDInput from "atoms/MDInput";
import Autocomplete from "@mui/material/Autocomplete";
import { IAutoCompleteSearch, IAutoCompleteSearchData } from "./types";

function AutoCompleteSearch({
  isLoading,
  options,
  value,
  onInputSearch,
  onSelectSearch,
}: IAutoCompleteSearch) {
  const optOpacity = isLoading ? 0.4 : 1;
  return (
    <Autocomplete
      id="truck-vans-search"
      clearOnBlur
      value={value as any}
      popupIcon={null}
      onChange={(e, selectedValue, reason) => onSelectSearch(selectedValue as any, reason)}
      onInputChange={onInputSearch}
      options={options}
      noOptionsText="No search"
      filterOptions={(x) => x}
      ListboxProps={{
        sx: {
          ".MuiAutocomplete-option": {
            opacity: optOpacity,
          },
        },
      }}
      isOptionEqualToValue={(option: IAutoCompleteSearchData, searchValue) => {
        if (option && searchValue) {
          return (
            option.vanno?.toLocaleLowerCase() === searchValue?.toLocaleLowerCase() ||
            option.vmrno?.toLocaleLowerCase() === searchValue?.toLocaleLowerCase()
          );
        }

        return false;
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return option.vmrno;
      }}
      sx={{ width: 250 }}
      renderInput={(params) => (
        <MDInput {...params} placeholder="Search" variant="standard" size="small" />
      )}
      renderOption={(props, option) => {
        return (
          <li key={option.id} {...props} style={{ display: "block" }}>
            <div>{option.vanno}</div>
            <small>{option.vmrno}</small>
          </li>
        );
      }}
    />
  );
}

export default AutoCompleteSearch;
