import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import Breadcrumbs from "organisms/Breadcrumbs";
import NotificationItem from "organisms/Items/NotificationItem";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "organisms/Navbars/DashboardNavbar/styles";
import { useAppDispatch } from "hooks";
import { signOut, setIsAuthenticated } from "redux/auth/action";

import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";
import { Theme } from "@mui/material/styles/createTheme";
import burceMars from "assets/images/bruce-mars.jpg";
import MDAvatar from "atoms/MDAvatar";
import selector from "./selector";
import { IDashboardNavbar, CSSPosition } from "./types";

function DashboardNavbar({ absolute, light, isMini }: IDashboardNavbar) {
  const reduxDispatch = useAppDispatch();
  const { name } = selector();
  const [navbarType, setNavbarType] = useState("sticky");
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openProfile, setOpenProfile] = useState(null);
  const [openNotification, setOpenNotification] = useState(null);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenProfile = (event) => setOpenProfile(event.currentTarget);
  const handleCloseProfile = () => setOpenProfile(null);
  const handleOpenNotification = (event) => setOpenNotification(event.currentTarget);
  const handleCloseNotification = () => setOpenNotification(null);

  const handleSignOut = () => {
    reduxDispatch(signOut());
    reduxDispatch(setIsAuthenticated(false));
    localStorage.removeItem("apiToken");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // Render the notifications menu
  const renderProfile = () => (
    <Menu
      anchorEl={openProfile}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(openProfile)}
      onClose={handleCloseProfile}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        icon={<Icon>manage_accounts</Icon>}
        title="Profile"
        onClick={handleProfile}
      />
      <NotificationItem icon={<Icon>logout</Icon>} title="Sign out" onClick={handleSignOut} />
    </Menu>
  );

  const renderNotification = () => (
    <Menu
      anchorEl={openNotification}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(openNotification)}
      onClose={handleCloseNotification}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>mail</Icon>} title="Mail" onClick={() => {}} />
      <NotificationItem icon={<Icon>message</Icon>} title="Chat" onClick={() => {}} />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }: Theme) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={(absolute ? "absolute" : navbarType) as CSSPosition}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDTypography
                variant="h6"
                component="span"
                fontWeight="regular"
                textTransform="capitalize"
                sx={({ typography: { pxToRem } }) => ({
                  fontSize: pxToRem(14),
                })}
              >
                {name}
              </MDTypography>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleOpenProfile}
                title="profile"
              >
                <MDAvatar src={burceMars} alt="profile-image" size="sm" shadow="sm" />
              </IconButton>
              {renderProfile()}
              <IconButton
                sx={({ typography: { pxToRem } }) => ({ navbarIconButton, fontSize: pxToRem(36) })}
                size="small"
                disableRipple
                onClick={handleOpenNotification}
                title="notification"
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderNotification()}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
                title="menu"
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

export default DashboardNavbar;
