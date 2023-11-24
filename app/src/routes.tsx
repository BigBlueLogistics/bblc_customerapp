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
// 12. The `allowedRoles` key is used for permission to access the route.

// import Tables from "pages/tables";
// import Billing from "pages/billing";
// import RTL from "pages/rtl";
// import Notifications from "pages/notifications";
import { lazy } from "react";
// @mui icons
import Icon from "@mui/material/Icon";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WebIcon from "@mui/icons-material/Web";
import LocalShipping from "@mui/icons-material/LocalShipping";
import AccountBalance from "@mui/icons-material/AccountBalance";

import RoutesType from "types/routes";

const Profile = lazy(() => import("pages/Profile"));
const Members = lazy(() => import("pages/Members"));
const SignIn = lazy(() => import("pages/Authentication/SignIn"));
const SignUp = lazy(() => import("pages/Authentication/SignUp"));
const ResetPasswordLink = lazy(() => import("pages/Authentication/ResetPasswordLink"));
const ResetPassword = lazy(() => import("pages/Authentication/ResetPassword"));
const Inventory = lazy(() => import("pages/Inventory"));
const Movements = lazy(() => import("pages/Movements"));
const Orders = lazy(() => import("pages/Orders"));
const Reports = lazy(() => import("pages/Reports"));
const Indicators = lazy(() => import("pages/Indicators"));
const TrucksVans = lazy(() => import("pages/TrucksVans"));
const Finance = lazy(() => import("pages/Finance"));
const DefaultPage = lazy(() => import("pages/DefaultPage"));
const NotFound = lazy(() => import("pages/NotFound"));

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
  {
    type: "",
    access: "protected",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    route: "*",
    component: <NotFound />,
    access: "public",
    key: "not-found",
  },
  {
    route: "/",
    component: <DefaultPage />,
    access: "public",
    key: "default-page",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
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
    name: "Reset Password Link",
    key: "reset-password-link",
    route: "/reset-password-link",
    component: <ResetPasswordLink />,
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
    index: true,
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/inventory",
    component: <Inventory />,
    title: "Check",
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Movements",
    key: "movements",
    icon: <TrendingUpIcon />,
    route: "/movements",
    component: <Movements />,
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <SummarizeIcon />,
    route: "/reports",
    component: <Reports />,
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <ShoppingCartIcon />,
    route: "/orders",
    component: <Orders />,
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Indicators",
    key: "indicators",
    icon: <MoveDownIcon />,
    route: "/indicators",
    component: <Indicators />,
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Members",
    key: "members",
    icon: <AccountBoxIcon />,
    route: "/members",
    component: <Members />,
    access: "protected",
    allowedRoles: ["sysadmin"],
  },
  {
    type: "collapse",
    name: "Trucks & Vans",
    key: "trucks-vans",
    icon: <LocalShipping />,
    route: "/trucks-vans",
    component: <TrucksVans />,
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
  {
    type: "collapse",
    name: "Finance",
    key: "finance",
    icon: <AccountBalance />,
    route: "/finance",
    component: <Finance />,
    access: "protected",
    allowedRoles: ["finance"],
  },
  {
    type: "collapse",
    name: "Website",
    key: "website",
    icon: <WebIcon />,
    href: "https://www.bigbluelogisticscorp.com",
    access: "protected",
    allowedRoles: ["sysadmin", "user", "finance"],
  },
];

export default routes;
