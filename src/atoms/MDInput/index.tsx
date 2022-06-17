import { forwardRef } from "react";
import MDInputRoot from "atoms/MDInput/MDInputRoot";
import { IMDInput } from "./types";

const MDInput = forwardRef<HTMLDivElement, IMDInput>(
  ({ error, success, disabled, ...rest }, ref) => (
    <MDInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
  )
);

MDInput.displayName = "MDInput";

// Setting default values for the props of MDInput
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

export default MDInput;
