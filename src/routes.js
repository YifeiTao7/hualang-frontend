import Profile from "layouts/profile";
import ViewArtistProfile from "layouts/ViewArtistProfile";
import ArtistTables from "layouts/tables/ArtistTables";
import CompanyTables from "layouts/tables/CompanyTables";
import ResetPassword from "layouts/authentication/reset-password/cover";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import ExhibitionPage from "layouts/ExhibitionPage";

// @mui icons
import Icon from "@mui/material/Icon";

export const artistRoutes = [
  {
    type: "collapse",
    name: "个人资料",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "作品集",
    key: "artist-tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/artist-tables",
    component: <ArtistTables />,
  },
  {
    type: "collapse",
    name: "重置密码",
    key: "reset-password",
    icon: <Icon fontSize="small">lock_reset</Icon>,
    route: "/authentication/reset-password",
    component: <ResetPassword />,
  },
  {
    type: "collapse",
    name: "登出",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "注册",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export const companyRoutes = [
  {
    type: "collapse",
    name: "管理",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "签约作品库",
    key: "company-tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/company-tables",
    component: <CompanyTables />,
  },
  {
    type: "collapse",
    name: "展会",
    key: "exhibitions",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/exhibitions",
    component: <ExhibitionPage />,
  },
  {
    type: "collapse",
    name: "重置密码",
    key: "reset-password",
    icon: <Icon fontSize="small">lock_reset</Icon>,
    route: "/authentication/reset-password",
    component: <ResetPassword />,
  },

  {
    type: "collapse",
    name: "登出",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "注册",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];
