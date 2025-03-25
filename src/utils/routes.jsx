import { Navigate } from "react-router-dom";
import Log_reg from "../pages/Public Pages/log_reg.jsx";
import Home from "../pages/Private Pages/Home.jsx";
import About from "../pages/Private Pages/About.jsx";
import FootballTeamDetails from "../pages/Private Pages/football/FootballTeamDetails.jsx";
import FootballData from "../pages/Private Pages/football/FootballData.jsx";
import UsersControl from "../pages/Private Pages/UsersControl/UsersControl.jsx";
import FootballTeamsControl from "../pages/Private Pages/football/FootballTeamsControl.jsx";
import AdminSettings from "../pages/Private Pages/AdminSettings/AdminSettings.jsx";
import FootballStats from "../pages/Private Pages/FootballStats/FootballStats.jsx";
import PrivacyPolicy from "../pages/Private Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import Contact from "../pages/Private Pages/Contact/Contact.jsx";

export const HOME_PAGE = "/";
export const ABOUT_PAGE = "/about";
export const LOG_REG_PAGE = "/login";
export const FOOTBALL_DATA_PAGE = "/footballdata";
export const FOOTBALL_TEAM_DETAILS_PAGE = "/footballdata/:teamId";
export const USERS_CONTROL_PAGE = "/userscontrol";
export const FOOTBALL_TEAMS_CONTROL_PAGE = "/footballteamscontrol";
export const ADMIN_SETTINGS_PAGE = "/adminsettings";
export const FOOTBALL_STATS_PAGE = "/footballstats";
export const PRIVACY_POLICY_PAGE = "/privacypolicy";
export const CONTACT_PAGE = "/contact";

export const publicRoutes = [
    { path: LOG_REG_PAGE, element: <Log_reg />, name: "Login" },
    { path: "*", element: <Navigate to={LOG_REG_PAGE} /> },
];

export const privateRoutes = [
    { path: HOME_PAGE, element: <Home />, name: "Home", menu: true },
    { path: ABOUT_PAGE, element: <About />, name: "About"},
    { path: FOOTBALL_TEAM_DETAILS_PAGE, element: <FootballTeamDetails />, name: "Team Details", menu: false },
    { path: FOOTBALL_DATA_PAGE, element: <FootballData />, name: "FootballData", menu: false, type: "Football" },
    { path: USERS_CONTROL_PAGE, element: <UsersControl />, name: "UsersControl", menu: false, type: "admin" },
    { path: FOOTBALL_TEAMS_CONTROL_PAGE, element: <FootballTeamsControl />, name: "FootballTCP", menu: false, type: "admin" },
    { path: ADMIN_SETTINGS_PAGE, element: <AdminSettings />, name: "AdminSettings", menu: false, type: "admin" },
    { path: FOOTBALL_STATS_PAGE, element: <FootballStats />, name: "FootballStats", menu: false, type: "Football" },
    { path: CONTACT_PAGE, element: <Contact />, menu: false, name: "Contact" },
    { path: PRIVACY_POLICY_PAGE, element: <PrivacyPolicy />, name: "PrivacyPolicy", menu: false },
    { path: "*", element: <Navigate to={HOME_PAGE} /> },
];
