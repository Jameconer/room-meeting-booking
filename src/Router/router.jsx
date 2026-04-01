import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../page/Error/errorweb";
import Appweb from "../Appweb";
import { MeetingRoomDashboard } from "../page/Page/dashboard";
import { AddBooking } from "../page/Page/addFormBooking";
import { CheckMeetingRoom } from "../page/Page/checkMeetingRoom";
import { EditBooking } from "../page/Page/editFormBooking";
import ProtectedRoute from "./protectedRouter";
import Login from "../Components/Login/login";
import OtpPage from "../Components/Login/otp";
import Register from "../Components/Login/register";
import Forgot from "../Components/Login/forgot";
import ForgotOtp from "../Components/Login/forgotOtp";

const createAppRouter = () => {
    const routes = [
        {
            path: "/",
            element: <Login />,
        },

        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/otp",
            element: <OtpPage />,
        },
        {
            path: "/reg",
            element: <Register />,
        },
        {
            path: "/forgot",
            element: <Forgot />,
        },
        {
            path: "/forgototp",
            element: <ForgotOtp />,
        },

        // ================= PROTECTED =================
        {
            element: <ProtectedRoute />, // 👈 guard ครอบ route
            children: [
                { path: "/List_RoomMeeting", element: <MeetingRoomDashboard /> },
                { path: "/Check_RoomMeeting", element: <CheckMeetingRoom /> },
                { path: "/Add_Booking", element: <AddBooking /> },
                { path: "/Edit_Booking", element: <EditBooking /> },
            ],
        },

        { path: "*", element: <ErrorPage /> },
    ];

    return createBrowserRouter(
        routes.map((route) => ({
            path: route.path,
            element: route.element,
            children: route.children,
            errorElement: route.errorElement || <ErrorPage />,
        }))
    );
};

export default createAppRouter;
