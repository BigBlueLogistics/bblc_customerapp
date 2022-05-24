import { PropTypes } from "prop-types";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDCheckboxRoot from "atoms/MDCheckbox/MDCheckboxRoot";

function MDCheckbox({ label, onChange, checked, ...rest }) {
  if (label) {
    return (
      <FormGroup {...rest}>
        <FormControlLabel
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

MDCheckbox.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

export default MDCheckbox;
