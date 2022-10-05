import Menu from "@mui/material/Menu";
import MDBox from "atoms/MDBox";
import DefaultNavbarLink from "organisms/Navbars/DefaultNavbar/DefaultNavbarLink";
import { IDefaultNavbarMobile } from "./types";

function DefaultNavbarMobile({ open, close }: IDefaultNavbarMobile) {
  let widthElem = 0;
  if (typeof open === "object") {
    const { width } = open && open.getBoundingClientRect();
    widthElem = width;
  }

  return (
    <Menu
      // @ts-ignore
      // getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open as Element}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${widthElem}px - 4rem)` } }}
    >
      <MDBox px={0.5}>
        <DefaultNavbarLink icon="account_circle" name="sign up" route="/sign-up" />
        <DefaultNavbarLink icon="key" name="sign in" route="/sign-in" />
      </MDBox>
    </Menu>
  );
}

export default DefaultNavbarMobile;
