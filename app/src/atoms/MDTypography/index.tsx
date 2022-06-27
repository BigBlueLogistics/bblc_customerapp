import { forwardRef } from "react";
import MDTypographyRoot from "atoms/MDTypography/MDTypographyRoot";
import { useMaterialUIController } from "context";
import { IMDTypography } from "./types";

const MDTypography = forwardRef<HTMLSpanElement, IMDTypography>(
  (
    { color, fontWeight, textTransform, verticalAlign, textGradient, opacity, children, ...rest },
    ref
  ) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDTypographyRoot
        {...rest}
        ref={ref}
        ownerState={{
          color,
          textTransform,
          verticalAlign,
          fontWeight,
          opacity,
          textGradient,
          darkMode,
        }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);

MDTypography.displayName = "MDTypography";

// Setting default values for the props of MDTypography
MDTypography.defaultProps = {
  color: "dark",
  fontWeight: false,
  textTransform: "none",
  verticalAlign: "unset",
  textGradient: false,
  opacity: 1,
};

export default MDTypography;
