import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Laout_component/navbar";
import { Calendar } from "../../Components/Laout_component/calendar";
import { CheckMeetingRoom } from "./checkMeetingRoom";

export function MeetingRoomDashboard() {

  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState(new Date());

  const fetchBookings = async () => {

    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const today = dayjs().format("YYYY-MM-DD");
  const todayBookings = bookings.filter(b => b.date === today);

  const stats = [
    { title: "ห้องทั้งหมด", value: 10, color: "text-blue-600" },
    { title: "จองวันนี้", value: todayBookings.length, color: "text-red-600" },
    { title: "ห้องว่าง", value: 10 - todayBookings.length, color: "text-green-600" }
  ];

  return (

    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* Menu */}
      <div className="pt-20 flex gap-8 text-md font-semibold justify-center bg-gray-900 py-2">
        <span
          onClick={() => setOpenCalendar(true)}
          className="cursor-pointer text-white hover:text-orange-500 transition"
        >
          ปฏิทินการจอง
        </span>
        <span
          onClick={() => navigate("/rooms")}
          className="cursor-pointer text-white hover:text-orange-500 transition"
        >
          ห้องประชุมทั้งหมด
        </span>
      </div>

      {/* Stats */}
      <div className="p-10 grid md:grid-cols-3 gap-8">
        {stats.map(({ title, value, color }) => (
          <div
            key={title}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition flex justify-between items-center min-h-[120px]"
          >
            <div>
              <p className="text-slate-500 text-base">
                {title}
              </p>
              <h2 className={`text-4xl font-bold ${color}`}>
                {value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="px-10 pb-10">

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="px-6 py-4 border-b flex items-center gap-6">

              {/* Search */}
              <div className="flex-1">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="ค้นหาการจอง / ห้องประชุม / ผู้จอง"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 pr-12 rounded-full border-2 border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                  />

                  <button
                    className="absolute right-4 text-slate-400 hover:text-blue-600 transition duration-200"
                    title="ค้นหา"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => setOpenAddPopup(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow whitespace-nowrap"
              >
                + จองห้องประชุม
              </button>

            </div>
          </div>

          <table className="w-full text-sm text-center">
            <thead className="bg-slate-50 text-slate-600 text-base font-semibold">
              <tr>
                <th className="p-4">ห้อง</th>
                <th className="p-4">ผู้จอง</th>
                <th className="p-4">วันที่</th>
                <th className="p-4">เวลา</th>
                <th className="p-4">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-slate-400">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={i} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-medium">
                      {b.room}
                    </td>
                    <td className="p-3">
                      {b.employee}
                    </td>
                    <td className="p-3">
                      {dayjs(b.date).format("DD MMM YYYY")}
                    </td>
                    <td className="p-3">
                      {b.startTime} - {b.endTime}
                    </td>
                    <td className="p-3">
                      {dayjs(b.date).isBefore(today) ? (
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          เสร็จสิ้น
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          กำลังจอง
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar Popup */}
      <Calendar
        open={openCalendar}
        onClose={() => setOpenCalendar(false)}
        bookings={bookings}
      />

      {/* Add Booking Popup */}
      <CheckMeetingRoom
        open={openAddPopup}
        onClose={() => setOpenAddPopup(false)}
        onSuccess={fetchBookings}
      />

    </div>
  );
}
