import { forwardRef } from "react";
import MDTypography from "atoms/MDTypography";
import MDProgressRoot from "atoms/MDProgress/MDProgressRoot";
import { TMDProgress } from "./types";

const MDProgress = forwardRef<any, TMDProgress>(
  ({ variant, color, value, label, ...rest }, ref) => (
    <>
      {label && (
        <MDTypography variant="button" fontWeight="medium" color="text">
          {value}%
        </MDTypography>
      )}
      <MDProgressRoot
        {...rest}
        ref={ref}
        variant="determinate"
        value={value}
        ownerState={{ color, value, variant }}
      />
    </>
  )
);

MDProgress.displayName = "MDProgress";

// Setting default values for the props of MDProgress
MDProgress.defaultProps = {
  variant: "contained",
  color: "info",
  value: 0,
  label: false,
};

export default MDProgress;
