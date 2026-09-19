import { createBrowserRouter, Navigate } from "react-router";
import SignIn from "../features/auth/SignIn";
import ResetPassword from "../features/auth/ResetPassword";
import ForgotPassword from "../features/auth/ForgotPassword";
import VerifyCode from "../features/auth/VerifyCode";
import NotFoundPage from "../features/auth/NotFoundPage";
import MainLayout from "../Layout/MainLayout";
import Dashboard from "../features/dashboard/Dashboard";
import Notifications from "../features/notifications/Notifications";
import Buildings from "../features/buildings/Buildings";
import Profile_and_Setting from "../features/Profile_and_Setting/Profile_and_Setting";
import Team_messaging from "../features/Team_messaging/Team_messaging";
import BuildingFlatsList from "../features/buildings/BuildingFlatsList";
import BuildingFlatDetails from "../features/buildings/BuildingFlatDetails";
import BuildingFlatDetailsEdit from "../features/buildings/BuildingFlatDetailsEdit";
import Maintenence from "../features/maintenance/Maintenence";
import HouseMaintenenceDetails from "../features/maintenance/HouseMaintenenceDetails";
import MiniAdmin from "../features/userManagement/MiniAdmin";
import Cleaners from "../features/userManagement/Cleaners";
import MaintenanceWorker from "../features/userManagement/MaintenanceWorker";
import Schedule from "../features/schedule/Schedule";
import Reports from "../features/reports/Reports";
import PrivateRoute from "../hooks/PrivateRoute";
import WeeklyWages from "../features/weeklyWages/WeeklyWages";


const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
            },
            {
                path: "dashboard/notifications",
                element: <PrivateRoute><Notifications /></PrivateRoute>,
            },
            {
                path: "buildings",
                element: <PrivateRoute><Buildings /></PrivateRoute>,
            },
            {
                path: "profile-settings",
                element: <PrivateRoute><Profile_and_Setting /></PrivateRoute>,
            },
            {
                path: "/team-messaging",
                element: <PrivateRoute><Team_messaging /></PrivateRoute>,
            }, {
                path: "buildings/:buildingId",
                element: <PrivateRoute><BuildingFlatsList /></PrivateRoute>
            },
            {
                path: "flats/:flatId",
                element: <PrivateRoute><BuildingFlatDetails /></PrivateRoute>,
            },
            {
                path: "flats/:flatId/edit",
                element: <PrivateRoute><BuildingFlatDetailsEdit /></PrivateRoute>,
            },
            {
                path: "maintenance",
                element: <PrivateRoute><Maintenence /></PrivateRoute>,
            },
            {
                path: "maintenance/:buildingId",
                element: <PrivateRoute><HouseMaintenenceDetails /></PrivateRoute>,
            },
            {
                path: "schedule",
                element: <PrivateRoute><Schedule /></PrivateRoute>,
            },
            {
                path: "user-management/mini-admin",
                element: <PrivateRoute><MiniAdmin /></PrivateRoute>,
            },
            {
                path: "user-management/cleaners",
                element: <PrivateRoute><Cleaners /></PrivateRoute>,
            },
            {
                path: "user-management/maintenance-worker",
                element: <PrivateRoute><MaintenanceWorker /></PrivateRoute>,
            },
            {
                path: "reports",
                element: <PrivateRoute><Reports /></PrivateRoute>,
            },
            {
                path: "weekly-wages",
                element: <PrivateRoute><WeeklyWages /></PrivateRoute>,
            },
        ]
    },




    // =========================== Auth Routes ============================ \\
    {
        path: "/login",
        element: <SignIn />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/verify-code",
        element: <VerifyCode />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },


    {
        path: "*",
        element: <NotFoundPage />,
    }


]);

export default router;