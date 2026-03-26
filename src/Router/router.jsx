import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../page/Error/errorweb";
import Appweb from "../Appweb";
import { MeetingRoomDashboard } from "../page/Page/dashboard";
import { AddBooking } from "../page/Page/addFormBooking";
import { CheckMeetingRoom } from "../page/Page/checkMeetingRoom";
import { EditBooking } from "../page/Page/editFormBooking";
import ProtectedRoute from "../Components/login/ProtectedRoute";

const createAppRouter = () => {
    const routes = [
        { path: "/", element: <Appweb /> }, // login page
        {
            path: "/List_RoomMeeting",
            element: (
                <ProtectedRoute>
                    <MeetingRoomDashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/Check_RoomMeeting",
            element: (
                <ProtectedRoute>
                    <CheckMeetingRoom />
                </ProtectedRoute>
            ),
        },
        {
            path: "/Add_Booking",
            element: (
                <ProtectedRoute>
                    <AddBooking />
                </ProtectedRoute>
            ),
        },
        {
            path: "/Edit_Booking",
            element: (
                <ProtectedRoute>
                    <EditBooking />
                </ProtectedRoute>
            ),
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
