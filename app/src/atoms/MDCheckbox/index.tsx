// @ts-nocheck
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDCheckboxRoot from "atoms/MDCheckbox/MDCheckboxRoot";
import { TMDCheckbox } from "./types";

function MDCheckbox({ label, onChange, name, checked, ...rest }: TMDCheckbox) {
  if (label) {
    return (
      <FormGroup {...rest}>
        <FormControlLabel
          name={name}
          control={<MDCheckboxRoot onChange={onChange} checked={checked} />}
          label={label}
        />
      </FormGroup>
    );
  }

  return <MDCheckboxRoot checked={checked} onChange={onChange} />;
}

MDCheckbox.defaultProps = {
  label: "",
  checked: false,
  onChange: () => {},
};

export default MDCheckbox;
