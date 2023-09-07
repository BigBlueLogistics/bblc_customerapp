import { forwardRef } from "react";
import MDBoxRoot from "atoms/MDBox/MDBoxRoot";
import { TMDBox } from "./types";

const MDBox = forwardRef<HTMLDivElement, TMDBox>(
  ({ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow, ...rest }, ref) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
  )
);

MDBox.displayName = "MDBox";

// Setting default values for the props of MDBox
MDBox.defaultProps = {
  variant: "contained",
  bgColor: "transparent",
  color: "dark",
  opacity: 1,
  borderRadius: "none",
  shadow: "none",
  coloredShadow: "none",
};

export default MDBox;
