import { forwardRef } from "react";
import MDInputRoot from "atoms/MDInput/MDInputRoot";
import { IMDInput } from "./types";

const MDInput = forwardRef<HTMLDivElement, IMDInput>(
  ({ error, success, disabled, endAdornment, ...rest }, ref) => (
    <MDInputRoot
      error={error}
      disabled={disabled}
      {...rest}
      ref={ref}
      ownerState={{ error, success, disabled, endAdornment }}
    />
  )
);

MDInput.displayName = "MDInput";

// Setting default values for the props of MDInput
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
  endAdornment: true,
};

export default MDInput;
