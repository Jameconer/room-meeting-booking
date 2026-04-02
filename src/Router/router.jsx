import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../page/Error/errorweb";
import { MeetingRoomDashboard } from "../page/Page/dashboard";
import { CheckMeetingRoom } from "../page/Page/checkMeetingRoom";
import ProtectedRoute from "./protectedRouter";

import Login from "../Components/Login/login";
import OtpPage from "../Components/Login/otp";
import Register from "../Components/Login/register";
import Forgot from "../Components/Login/forgot";
import ForgotOtp from "../Components/Login/forgotOtp";

const createAppRouter = () => {
    return createBrowserRouter([
        // ================= PUBLIC =================
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "/otp", element: <OtpPage /> },
        { path: "/reg", element: <Register /> },
        { path: "/forgot", element: <Forgot /> },
        { path: "/forgototp", element: <ForgotOtp /> },

        // ================= PROTECTED =================
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/List_RoomMeeting",
                    element: <MeetingRoomDashboard />
                },
                {
                    path: "/Check_RoomMeeting",
                    element: <CheckMeetingRoom />
                },
            ],
        },

        // ================= 404 =================
        { path: "*", element: <ErrorPage /> },
    ]);
};

export default createAppRouter;
