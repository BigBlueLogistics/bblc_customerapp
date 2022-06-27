import { forwardRef } from "react";
import MDAvatarRoot from "atoms/MDAvatar/MDAvatarRoot";
import { IMDAvatar } from "./types";

const MDAvatar = forwardRef<HTMLDivElement, IMDAvatar>(
  ({ bgColor, size, shadow, ...rest }, ref) => (
    <MDAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
  )
);

MDAvatar.displayName = "MDAvatar";

// Setting default values for the props of MDAvatar
MDAvatar.defaultProps = {
  bgColor: "transparent",
  size: "md",
  shadow: "none",
};

export default MDAvatar;
