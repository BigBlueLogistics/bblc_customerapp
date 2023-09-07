import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDTypography from "atoms/MDTypography";
import { TMenuAction } from "./types";

function MenuAction({ anchorEl, onClose, items }: TMenuAction) {
  return (
    <Menu
      id="action"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {items.length
        ? items.map((item) => (
            <MenuItem onClick={item.onClick} key={item.label}>
              {item.icon}
              <MDTypography
                ml={1}
                variant="body2"
                sx={({ typography: { pxToRem } }) => ({
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                })}
              >
                {item.label}
              </MDTypography>
            </MenuItem>
          ))
        : null}
    </Menu>
  );
}

export default MenuAction;
