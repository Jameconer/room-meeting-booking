import { Logout } from "../Login/logout";

export function Navbar({ title = "Meeting Room" }) {
    return (
        <div className="fixed w-full z-10 flex justify-between items-center bg-[#030697] text-[#f8f8f8] px-8 py-4 shadow-lg">
            <div className="flex items-center gap-3">
                <img
                    src={import.meta.env.VITE_IMG_RoomMeetingLogo}
                    className="auto h-10 rounded-full"
                />
                <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 via-red-400 to-yellow-300 bg-clip-text text-transparent">
                    {title}
                </h2>
            </div>

            <Logout />
        </div>
    );
}
