import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MDFormControlRoot from "atoms/MDSelect/MDFormControlRoot";

import MDSelectRoot from "atoms/MDSelect/MDSelectRoot";
import { TMDSelect } from "./types";

function MDSelect<TOption extends object = { value: string | number; label: string }[]>({
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
}: TMDSelect<TOption>) {
  const renderOptionsWithoutCustomKeys = () => {
    return (
      options?.length &&
      options.map((optValue, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItem key={idx} value={optValue as unknown as string} sx={itemStyle}>
          {optValue as unknown as string}
        </MenuItem>
      ))
    );
  };

  const renderOptionsWithCustomKeys = () => {
    if (withOptionKeys) {
      const customOptValue = optKeyValue;
      const customOptLabel = optKeyLabel;

      return (
        options?.length &&
        options.map((opt) => (
          <MenuItem
            key={opt[customOptValue] as string}
            value={opt[customOptValue] as unknown as string}
            sx={itemStyle}
          >
            {opt[customOptLabel] as unknown as string}
          </MenuItem>
        ))
      );
    }

    return renderOptionsWithoutCustomKeys();
  };

  return (
    <MDFormControlRoot variant={variant} error={error} ownerState={{ variant }} {...rest}>
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
