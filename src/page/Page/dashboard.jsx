import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Navbar } from "../../Components/Laout_component/navbar";
import { CheckMeetingRoom } from "./checkMeetingRoom";

export function MeetingRoomDashboard() {

  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [roomData, setRoomData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // -------- SELECT TIME --------
  const [selectedStart, setSelectedStart] = useState(dayjs());
  const [selectedEnd, setSelectedEnd] = useState(dayjs().add(1, "hour"));
  const [selectedImage, setSelectedImage] = useState(null);

  const allEquipment = ["TV", "Projector", "Speaker", "Zoom", "Whiteboard"];

  const demoEquipment = allEquipment
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // กันเลือกเวลาเพี้ยน
  useEffect(() => {
    if (selectedStart.isAfter(selectedEnd)) {
      setSelectedEnd(selectedStart.add(1, "hour"));
    }
  }, [selectedStart]);

  useEffect(() => {
    if (roomData.length > 0) {
      setLoading(false);
    }
  }, [roomData]);

  useEffect(() => {
    if (selectedStart.isAfter(selectedEnd)) {
      setSelectedEnd(selectedStart.add(1, "hour"));
    }
  }, [selectedStart]);

  // -------- CHECK AVAILABLE --------
  const isRoomAvailable = (room) => {
    return !room.bookings.some((b) => {
      return (
        selectedStart.isBefore(b.end_at) &&
        selectedEnd.isAfter(b.start_at)
      );
    });
  };

  // -------- GET STATUS --------
  const getRoomStatus = (room) => {
    const now = dayjs();

    const todayBookings = room.bookings.filter(b =>
      b.start_at.isSame(selectedStart, "day")
    );

    const current = todayBookings.find(b =>
      now.isAfter(b.start_at) && now.isBefore(b.end_at)
    );

    const next = todayBookings
      .filter(b => now.isBefore(b.start_at))
      .sort((a, b) => a.start_at - b.start_at)[0];

    return {
      current,
      next,
      isBusy: !!current,
      roomBookings: room.bookings
    };
  };

  const availableRooms = roomData.filter(r => isRoomAvailable(r)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Navbar />

      {/* HEADER */}
      <div className="pt-5 px-10 flex justify-between items-center">
      </div>

      {/* TIME SELECT */}
      <div className="px-4 sm:px-10 mt-6 sm:mt-20">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

            {/* START DATETIME */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-gray-900 mb-1">เริ่ม</label>
              <input
                type="datetime-local"
                value={selectedStart.format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setSelectedStart(dayjs(e.target.value))}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 w-full"
              />
            </div>

            {/* END DATETIME */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-gray-900 mb-1">สิ้นสุด</label>
              <input
                type="datetime-local"
                value={selectedEnd.format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setSelectedEnd(dayjs(e.target.value))}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 w-full"
              />
            </div>

            {/* STATUS */}
            <div className="flex flex-col justify-end">
              <p className="text-xs text-gray-500">ห้องพร้อมใช้งาน</p>
              <p className="text-lg font-semibold">{availableRooms} ห้อง</p>
            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => setOpenAddPopup(true)}
            className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl shadow hover:scale-105 transition w-full sm:w-auto"
          >
            + จองห้อง
          </button>

        </div>
      </div>

      {/* GRID */}
      <div className="p-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading...
          </div>
        ) : roomData.map((room) => {

          const { current, next, roomBookings } = getRoomStatus(room);
          const available = isRoomAvailable(room);

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border hover:shadow-xl transition overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_IMG_RoomMeeting}/thumbnail.jpg`}
                  className="h-40 w-full object-cover"
                />


                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-3 left-4 text-white">
                  <h2 className="font-semibold">{room.name}</h2>
                  <p className="text-xs">{room.capacity} คน</p>

                  {/* เผื่อไว้ */}
                  <p className="text-[14px] mt-1 px-1 py-[0.5px] bg-[#3b2b83] rounded inline-block">
                    Sriracha Construction Public Company Limited
                  </p>

                </div>

                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-white/80 backdrop-blur shadow">
                    <span className={`w-2 h-2 rounded-full ${available ? "bg-emerald-500" : "bg-red-500"}`} />
                    {available ? "พร้อมใช้งาน" : "ถูกจอง"}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* CURRENT */}
                {current && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-400">Now</p>
                    <p className="text-sm font-medium">{current.title}</p>
                    <p className="text-xs text-gray-400">
                      {current.start_at.format("HH:mm")} - {current.end_at.format("HH:mm")}
                    </p>
                  </div>
                )}

                {/* NEXT */}
                {next && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Next</p>
                    <p className="text-sm">{next.title}</p>
                    <p className="text-xs text-gray-400">
                      {next.start_at.format("HH:mm")}
                    </p>
                  </div>
                )}

                {/* TIMELINE */}
                <div className="relative">

                  <div className="relative h-1.5 bg-green-100 rounded-full overflow-hidden">

                    {roomBookings
                      .filter(b =>
                        b.start_at.isSame(selectedStart, "day")
                      )
                      .map((b, i) => {

                        const start = b.start_at.hour();
                        const end = b.end_at.hour();

                        const safeStart = Math.max(start, 8);
                        const safeEnd = Math.min(end, 17);

                        if (safeEnd <= safeStart) return null;

                        return (
                          <div
                            key={i}
                            className="absolute top-0 h-full bg-red-500/80 rounded-full"
                            style={{
                              left: `${((safeStart - 8) / 9) * 100}%`,
                              width: `${((safeEnd - safeStart) / 9) * 100}%`
                            }}
                          />
                        );
                      })}
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>17:00</span>
                  </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {demoEquipment.map((eq, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border"
                    >
                      {eq === "TV" && "📺"}
                      {eq === "Projector" && "📽️"}
                      {eq === "Speaker" && "🔊"}
                      {eq === "Zoom" && "💻"}
                      {eq === "Whiteboard" && "📝"}
                      {eq === "Camera" && "📷"}
                      {eq === "Mic" && "🎤"}
                      {eq}
                    </span>
                  ))}
                </div>

                {/* BUTTON */}
                {available && (
                  <button
                    onClick={() => {
                      setSelectedRoomForBooking(room);
                      setOpenAddPopup(true);
                    }}
                    className="mt-4 w-full border border-gray-300 py-2 rounded-xl hover:bg-gray-900 hover:text-white transition"
                  >
                    จองห้องนี้
                  </button>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* POPUP */}
      <CheckMeetingRoom
        open={openAddPopup}
        onClose={() => {
          setOpenAddPopup(false);
          setSelectedRoomForBooking(null);
        }}
        onDataLoaded={setRoomData}
        defaultRoom={selectedRoomForBooking}
      />

    </div >
  );
}
