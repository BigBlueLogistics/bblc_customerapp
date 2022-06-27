import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MDFormControlRoot from "atoms/MDSelect/MDFormControlRoot";
import FormHelperText from "@mui/material/FormHelperText";

import MDSelectRoot from "atoms/MDSelect/MDSelectRoot";
import { IMDSelect } from "./types";

function MDSelect({
  onChange,
  options,
  value,
  label,
  helperText,
  showArrowIcon,
  optKeyValue,
  optKeyLabel,
  ...rest
}: IMDSelect) {
  // eslint-disable-next-line no-console
  console.log("MD Select", value);
  const renderOptionsWithCustomKeys = () => {
    const customOptValue = optKeyValue || "value";
    const customOptLabel = optKeyLabel || "label";

    return (
      options.length &&
      options.map((opt) => (
        <MenuItem key={opt[customOptValue]} value={opt[customOptValue]}>
          {opt[customOptLabel]}
        </MenuItem>
      ))
    );
  };

  return (
    <MDFormControlRoot sx={{ m: 1, minWidth: 130 }} {...rest}>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {label && <InputLabel id={`select-label-${label}`}>{label}</InputLabel>}
      <MDSelectRoot
        variant="standard"
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        value={value}
        label={label}
        onChange={onChange}
        ownerState={{ showArrowIcon }}
      >
        {renderOptionsWithCustomKeys()}
      </MDSelectRoot>
    </MDFormControlRoot>
  );
}

MDSelect.defaultProps = {
  label: "",
  helperText: "",
  showArrowIcon: false,
  optKeyValue: "value",
  optKeyLabel: "label",
};

export default MDSelect;
