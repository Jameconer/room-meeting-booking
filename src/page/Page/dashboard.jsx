import { useState, useEffect, } from "react";
import dayjs from "dayjs";
import { Navbar } from "../../Components/Laout_component/navbar";
import { CheckMeetingRoom } from "./checkMeetingRoom";
import axios from "axios";

export function MeetingRoomDashboard() {

  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [roomData, setRoomData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // -------- SELECT TIME --------
  const [selectedStart, setSelectedStart] = useState(dayjs());
  const [selectedEnd, setSelectedEnd] = useState(dayjs().add(1, "hour"));

  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  const [images, setImages] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  const [activeTab, setActiveTab] = useState("all");

  const [roomImageCache, setRoomImageCache] = useState({});

  const filteredRooms = Array.from(
    new Map(
      roomData.map(r => [r.id, r]) // Map เก็บแค่ id เดียว
    ).values()
  ).filter(room => {
    if (activeTab === "all") return true;
    if (activeTab === "meeting") return room.name.includes("ประชุม");
    if (activeTab === "training") return room.name.includes("อบรม");
    return false;
  });

  useEffect(() => {
    const uncachedRooms = filteredRooms.filter(room => !roomImageCache[room.id]);
    if (uncachedRooms.length === 0) return;

    uncachedRooms.forEach(room => {
      const thumbnailUrl = `${import.meta.env.VITE_IMG_RoomMeeting}/${room.id}/thumbnail.jpg`;
      const img = new Image();

      img.onload = () => {
        setRoomImageCache(prev => ({ ...prev, [room.id]: thumbnailUrl }));
      };

      img.onerror = () => {
        setRoomImageCache(prev => ({ ...prev, [room.id]: import.meta.env.VITE_IMG_RoomMeetingDefault }));
      };

      img.src = thumbnailUrl;
    });
  }, [filteredRooms, roomImageCache]);

  useEffect(() => {
    if (!activeRoom) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(
          "http://192.168.16.203:8090/api/file/getfilebypath",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: `D:\\Intranet\\Intranet_File\\UploadFile\\Utility\\Meeting_Rooms\\${activeRoom.id}`
            }),
          }
        );

        const data = await res.json();

        const files = (data || [])
          .filter(f => f.type === "file")
          .map(f => f.name)
          .filter(name => name !== "thumbnail.jpg")
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map(name =>
            `${import.meta.env.VITE_IMG_RoomMeeting}/${activeRoom.id}/${name}`
          );

        setImages(files);

      } catch (err) {
        console.error("ERROR =", err);
      }
    };

    fetchImages();
  }, [activeRoom]);

  useEffect(() => {

    axios.post("http://192.168.16.203:8090/api/intranet/savevisits", {
      "APP_ID": 19
    })

  }, []);

  const allEquipment = ["TV", "Projector", "Speaker", "Zoom", "Whiteboard"];

  const demoEquipment = allEquipment
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

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
      <div className="px-4 sm:px-10 mt-6 sm:mt-16">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">

            {/* TIME SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">เริ่ม</label>
                <input
                  type="datetime-local"
                  value={selectedStart.format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => setSelectedStart(dayjs(e.target.value))}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">สิ้นสุด</label>
                <input
                  type="datetime-local"
                  value={selectedEnd.format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => setSelectedEnd(dayjs(e.target.value))}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>

            {/* STATUS + FILTER */}
            <div className="flex items-center gap-6 flex-wrap">

              {/* FILTER */}
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-500 whitespace-nowrap">ประเภทห้อง</p>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["all", "meeting", "training"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`px-4 py-1.5 rounded-lg text-sm transition whitespace-nowrap
            ${activeTab === type
                          ? "bg-white shadow text-blue-600 font-medium"
                          : "text-gray-600 hover:text-black"
                        }`}
                    >
                      {type === "all"
                        ? "ทั้งหมด"
                        : type === "meeting"
                          ? "ประชุม"
                          : "อบรม"}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-6 border-l opacity-30" />

              {/* STATUS */}
              <div className="flex items-center gap-2">
                <p className="text-[18px] text-gray-500 whitespace-nowrap">
                  ห้องพร้อมใช้งาน
                </p>
                <p className="text-xl font-semibold text-emerald-600">
                  {availableRooms}
                </p>
                <span className="text-[18px] text-gray-500">ห้อง</span>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={() => setOpenAddPopup(true)}
                className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl shadow hover:scale-105 hover:bg-emerald-600 transition"
              >
                + จองห้อง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="p-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading...
          </div>
        ) : filteredRooms.map((room, idx) => {
          const { current, next, roomBookings } = getRoomStatus(room);
          const available = isRoomAvailable(room);

          return (
            <div
              onClick={() => {
                setActiveRoom(room);
                setOpenImagePopup(true);
              }}
              key={`${room.id}-${idx}`}
              className="group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 
                         hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400
                        ">

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={roomImageCache[room.id] || import.meta.env.VITE_IMG_RoomMeetingDefault}
                  className="h-40 w-full object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRoom(room);
                    setOpenImagePopup(true);
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">

                  {/* ROOM NAME */}
                  <h2 className="text-[26px] font-semibold leading-tight drop-shadow-md">
                    {room.name}
                  </h2>

                  {/* LOCATION */}
                  <p className="text-xxl mt-1 font-semibold leading-tight drop-shadow-md">
                    <span className="truncate">{room.location}</span>
                  </p>

                  {/* CAPACITY */}
                  <p className="text-xxl mt-1 font-medium opacity-90">
                    {room.capacity} คน
                  </p>

                  {/* COMPANY TAG */}
                  <div className="mt-2">
                    <span className="text-[14px] px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                      Sriracha Construction Public Company Limited
                    </span>
                  </div>

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
                    onClick={(e) => {
                      e.stopPropagation();
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

      </div >

      {/* POPUP */}
      < CheckMeetingRoom
        open={openAddPopup}
        onClose={() => {
          setOpenAddPopup(false);
          setSelectedRoomForBooking(null);
        }}
        onDataLoaded={setRoomData}
        defaultRoom={selectedRoomForBooking}
      />

      {openImagePopup && activeRoom && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setOpenImagePopup(false)}
        >

          {/* กล่อง popup */}
          <div
            className="bg-white w-[95%] max-w-6xl rounded-3xl p-6 relative shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ปิด */}
            <button
              onClick={() => setOpenImagePopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* ชื่อห้อง */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 tracking-tight flex items-center gap-2">
              <span className="inline-block w-1.5 h-6 bg-blue-500 rounded-full"></span>
              {activeRoom.name}
            </h2>

            {/* รูปทั้งหมด */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto pr-2">

              {images.map((img, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  onClick={() => setZoomImage(img)}
                >
                  <img
                    src={img}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 object-cover transition duration-200 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-sm">ขยาย</span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}

      {
        zoomImage && (
          <div
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[95%] max-h-[95%] rounded-2xl shadow-2xl animate-zoomIn"
            />
          </div>
        )
      }

    </div >
  );
}
