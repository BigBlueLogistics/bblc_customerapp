import { forwardRef } from "react";
import MDButtonRoot from "atoms/MDButton/MDButtonRoot";
import { useMaterialUIController } from "context";
import { IMDButton } from "./types";

const MDButton = forwardRef<HTMLButtonElement, IMDButton>(
  ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
      >
        {children}
      </MDButtonRoot>
    );
  }
);

MDButton.displayName = "MDButton";

// Setting default values for the props of MDButton
MDButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

export default MDButton;
