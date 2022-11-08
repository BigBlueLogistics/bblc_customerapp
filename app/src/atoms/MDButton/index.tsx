import { forwardRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MDButtonRoot from "atoms/MDButton/MDButtonRoot";
import { useMaterialUIController } from "context";
import { IMDButton } from "./types";

const MDButton = forwardRef<HTMLButtonElement, IMDButton>(
  ({ color, variant, size, circular, iconOnly, children, loading, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    console.log("isLoadingzz!", loading);
    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : children}
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
  loading: false,
};

export default MDButton;
