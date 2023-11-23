import { forwardRef } from "react";
import MDInputRoot from "atoms/MDInput/MDInputRoot";
import { TMDInput } from "./types";

const MDInput = forwardRef<HTMLDivElement, TMDInput>(
  ({ error, success, disabled, endAdornment, variant, ...rest }, ref) => (
    <MDInputRoot
      error={error}
      disabled={disabled}
      variant={variant}
      {...rest}
      ref={ref}
      ownerState={{ error, success, disabled, endAdornment, variant }}
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
  variant: "outlined",
};

export default MDInput;
