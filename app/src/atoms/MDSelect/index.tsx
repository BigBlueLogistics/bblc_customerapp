import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MDFormControlRoot from "atoms/MDSelect/MDFormControlRoot";

import MDSelectRoot from "atoms/MDSelect/MDSelectRoot";
import { TMDSelect } from "./types";

function MDSelect({
  name,
  onChange,
  variant,
  options,
  value,
  label,
  error,
  helperText,
  showArrowIcon,
  optKeyValue,
  optKeyLabel,
  withOptionKeys,
  itemStyle,
  ...rest
}: TMDSelect) {
  const renderOptionsWithoutCustomKeys = () => {
    return (
      options?.length &&
      options.map((optValue, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItem key={idx} value={optValue} sx={itemStyle}>
          {optValue}
        </MenuItem>
      ))
    );
  };

  const renderOptionsWithCustomKeys = () => {
    if (withOptionKeys) {
      const customOptValue = optKeyValue || "value";
      const customOptLabel = optKeyLabel || "label";

      return (
        options?.length &&
        options.map((opt) => (
          <MenuItem key={opt[customOptValue]} value={opt[customOptValue]} sx={itemStyle}>
            {opt[customOptLabel]}
          </MenuItem>
        ))
      );
    }

    return renderOptionsWithoutCustomKeys();
  };

  return (
    <MDFormControlRoot variant={variant} error={error} {...rest}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <MDSelectRoot
        name={name}
        variant={variant}
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        value={value}
        label={label}
        onChange={onChange}
        ownerState={{ showArrowIcon, variant }}
        error={error}
      >
        {renderOptionsWithCustomKeys()}
      </MDSelectRoot>
      {helperText && (
        <FormHelperText error={error} variant={variant}>
          {helperText}
        </FormHelperText>
      )}
    </MDFormControlRoot>
  );
}

MDSelect.defaultProps = {
  variant: "standard",
  label: "",
  helperText: "",
  showArrowIcon: false,
  optKeyValue: "value",
  optKeyLabel: "label",
  withOptionKeys: true,
};

export default MDSelect;
