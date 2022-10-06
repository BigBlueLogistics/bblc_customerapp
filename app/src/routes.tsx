// 1. The `type` key with the `collapse` value is used for a route.
// 2. The `type` key with the `title` value is used for a title inside the Sidenav.
// 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
// 4. The `name` key is used for the name of the route on the Sidenav.
// 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
// 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
// 7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
// inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
// 8. The `route` key is used to store the route location which is used for the react router.
// 9. The `href` key is used to store the external links location.
// 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
// 10. The `component` key is used to store the component of its route.
// 11. The `access` key is used to determine if route is set to public or protected.

import Dashboard from "pages/dashboard";
// import Tables from "pages/tables";
// import Billing from "pages/billing";
// import RTL from "pages/rtl";
// import Notifications from "pages/notifications";
// import Profile from "pages/profile";
import SignIn from "pages/Authentication/SignIn";
import SignUp from "pages/Authentication/SignUp";
import ResetPassword from "pages/Authentication/ResetPassword";
import ChangePassword from "pages/Authentication/ChangePassword";
import Inventory from "pages/Inventory";

// @mui icons
import Icon from "@mui/material/Icon";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WebIcon from "@mui/icons-material/Web";

import RoutesType from "types/routes";

const routes: RoutesType = [
  // {
  //   type: "collapse", // collapse
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  // {
  //   type: "",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  {
    type: "",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
    access: "public",
  },
  {
    type: "",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
    access: "public",
  },
  {
    type: "",
    name: "Reset Password",
    key: "reset-password",
    route: "/reset-password",
    component: <ResetPassword />,
    access: "public",
  },
  {
    type: "",
    name: "Change Password",
    key: "change-password",
    route: "/change-password",
    component: <ChangePassword />,
    access: "public",
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/inventory",
    component: <Inventory />,
    title: "Check",
    access: "protected",
  },
  {
    type: "collapse",
    name: "Movements",
    key: "movements",
    icon: <TrendingUpIcon />,
    route: "/movements",
    component: () => <h3>Coming soon</h3>,
    access: "protected",
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <SummarizeIcon />,
    route: "/reports",
    component: () => <h3>Coming soon</h3>,
    access: "protected",
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <ShoppingCartIcon />,
    route: "/reports",
    component: () => <h3>Coming soon</h3>,
    access: "protected",
  },
  {
    type: "collapse",
    name: "Indicators",
    key: "indicators",
    icon: <MoveDownIcon />,
    route: "/indicators",
    component: <Dashboard />,
    access: "protected",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <AccountBoxIcon />,
    route: "/profile",
    component: () => <h3>Coming soon</h3>,
    access: "protected",
  },
  {
    type: "collapse",
    name: "Website",
    key: "website",
    icon: <WebIcon />,
    route: "/website",
    component: () => <h3>Coming soon</h3>,
    access: "protected",
  },
];

export default routes;
