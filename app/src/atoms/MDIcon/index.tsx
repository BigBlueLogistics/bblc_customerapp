import { forwardRef } from "react";
import MDIconRoot from "atoms/MDIcon/MDIconRoot";
import { IMDIcon } from "./types";

const MDIcon = forwardRef<HTMLSpanElement, IMDIcon>(({ fontSize, children, ...rest }, ref) => (
  <MDIconRoot {...rest} ref={ref} ownerState={{ fontSize }}>
    {children}
  </MDIconRoot>
));

MDIcon.displayName = "MDIcon";

MDIcon.defaultProps = {
  fontSize: "medium",
};

export default MDIcon;
