import { useState, useRef, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AddBooking } from "./addFormBooking";
import { MonthlySchedule } from "./monthlySchedule";
import { EditBooking } from "./editFormBooking";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export function CheckMeetingRoom({ onDataLoaded = () => { } }) {

  const navigate = useNavigate();

  const location = useLocation();
  const defaultRoom = location.state?.room;

  const [roomData, setRoomData] = useState({ stats: [] });
  const [allRooms, setAllRooms] = useState([]);

  const rowRefs = useRef({});

  const today = new Date();

  // MONTH CONTROL
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth()
  });

  useEffect(() => {

    const monthStr = `${currentDate.year}-${String(currentDate.month + 1).padStart(2, "0")}`;

    fetch("http://192.168.16.203:8090/api/booking/get_meeting_rooms_booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        month: monthStr
      })
    })
      .then(res => res.json())
      .then(data => {
        const apiRooms = data.data || [];

        const dedupedRooms = Array.from(
          new Map(apiRooms.map(r => [r.room_id, r])).values()
        );

        const roomNames = dedupedRooms.map(r => r.room);
        setAllRooms([...new Set(roomNames)]);

        const formatted = {
          stats: dedupedRooms.map((r) => ({
            room: r.room,
            room_id: r.room_id,
            capacity: r.capacity,
            location: r.full_name_th,
            equipment: "",

            bookings: r.bookings.map(b => ({
              id: b.id,
              startDateTime: b.start_at,
              endDateTime: b.end_at,
              meeting_title: b.meeting_title || "",
              job: b.job || "",
              meeting_description: b.meeting_description || "",
              attendee_count: b.attendee_count ?? 0
            }))
          }))
        };

        setRoomData(formatted);

        if (onDataLoaded) {
          onDataLoaded(
            dedupedRooms.map(r => ({
              id: r.room_id,
              name: r.room,
              capacity: r.capacity,
              location: r.full_name_th,
              bookings: r.bookings.map(b => ({
                id: b.id,
                start_at: dayjs(b.start_at),
                end_at: dayjs(b.end_at),
                title: b.meeting_title
              }))
            }))
          );
        }

      })
      .catch(err => console.error(err));

  }, [currentDate]);

  useEffect(() => {
    if (defaultRoom) {
      setRoomFilter(defaultRoom.name);
    } else {
      setRoomFilter("");
    }
  }, [defaultRoom]);

  const tableRef = useRef(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  const [resultRooms, setResultRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [roomFilter, setRoomFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const isOverlapping = (newStart, newEnd, bookings, excludeId = null) => {
    return bookings.some(b => {
      if (excludeId && b.id === excludeId) return false;

      const oldStart = new Date(b.startDateTime);
      const oldEnd = new Date(b.endDateTime);

      return new Date(newStart) < oldEnd && new Date(newEnd) > oldStart;
    });
  };

  // ADD BOOKING
  const handleAddBooking = (newBooking) => {

    setRoomData((prev) => {
      return {
        stats: prev.stats.map((room) => {
          if (room.room !== newBooking.room) return room;

          return {
            ...room,
            bookings: [...room.bookings, newBooking]
          };
        })
      };
    });

    const d = new Date(newBooking.startDateTime);
    setCurrentDate({
      year: d.getFullYear(),
      month: d.getMonth()
    });

    setSelectedRoom(null);
  };

  // EDIT BOOKING
  const handleEditBooking = (updated) => {
    setRoomData(prev => ({
      stats: prev.stats.map(room => {

        if (room.room !== updated.room) return room;

        return {
          ...room,
          bookings: room.bookings.map(b =>
            b.id === updated.id
              ? {
                ...b,
                startDateTime: updated.startDateTime,
                endDateTime: updated.endDateTime,
                meeting_title: updated.title,
                job: updated.job,
                meeting_description: updated.description,
                attendee_count: updated.attendee
              }
              : b
          )
        };
      })
    }));

    setEditBooking(null);
  };

  const handleDeleteBooking = (target) => {
    setRoomData((prev) => ({
      stats: prev.stats.map((room) => ({
        ...room,
        bookings: room.bookings.filter((b) =>
          !(b.startDateTime === target.startDateTime &&
            b.endDateTime === target.endDateTime &&
            room.room === target.room)
        )
      }))
    }));
  };

  const changeMonth = (step) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.year, prev.month + step, 1);
      return {
        year: newDate.getFullYear(),
        month: newDate.getMonth()
      };
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth()
    });

    const todayDay = now.getDate();
    if (rowRefs.current[todayDay]) {
      rowRefs.current[todayDay].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  // FILTER ROOM
  const displayRooms = [...new Set(roomData.stats.map(r => r.room))].filter((room) => {

    if (activeTab === "training") return room.includes("ห้องอบรม");
    if (activeTab === "meeting") return !room.includes("ห้องอบรม");

    return true;
  });

  const filteredRooms =
    roomFilter === ""
      ? displayRooms
      : displayRooms.filter((room) => room === roomFilter);

  const handleCellClick = ({ room, day }) => {

    const date = `${currentDate.year}-${String(currentDate.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const roomInfo = roomData.stats.find(r => r.room === room);

    setSelectedRoom({
      room,
      room_id: roomInfo.room_id,
      capacity: roomInfo.capacity,
      bookings: roomInfo.bookings,
      date
    });
  };

  const monthlySchedule = useMemo(() => {

    const year = currentDate.year;
    const month = currentDate.month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;

      const rooms = Object.fromEntries(
        roomData.stats.map((room) => {

          const bookings = room.bookings.filter((b) => {
            const d = new Date(b.startDateTime);

            return (
              d.getFullYear() === year &&
              d.getMonth() === month &&
              d.getDate() === day
            );
          });

          return [room.room, bookings];
        })
      );

      return { day, rooms };
    });
  }, [currentDate, roomData]);

  // UI
  return (
    <div className="w-full min-h-screen bg-gray-100">

      <div className="bg-white rounded-xxl shadow-lg flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between shadow-md">

          {/* LEFT - TITLE */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-white/80 rounded-full"></div>
            <h2 className="text-md sm:text-2xl font-semibold tracking-wide">
              ระบบจองห้องประชุม
            </h2>
          </div>

          {/* RIGHT - BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-6 py-2.5 rounded-xl shadow hover:scale-105 hover:bg-red-600 transition"
          >
            ย้อนกลับ
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 p-6 flex flex-col gap-6 min-h-0">

          <MonthlySchedule
            data={monthlySchedule}
            currentDate={currentDate}
            changeMonth={changeMonth}
            goToToday={goToToday}
            tableRef={tableRef}
            displayRooms={displayRooms}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            roomFilter={roomFilter}
            setRoomFilter={setRoomFilter}
            filteredRooms={filteredRooms}
            onCellClick={handleCellClick}
            useState={useState}
            useMemo={useMemo}
            rowRefs={rowRefs}
            onEditBooking={(booking) => {
              const roomInfo = roomData.stats.find(r => r.room === booking.room);

              setEditBooking({
                id: booking.id,
                ...booking,
                room_id: roomInfo?.room_id,
                capacity: roomInfo?.capacity,
                bookings: roomInfo?.bookings || []
              });
            }}
          />

        </div>

        {/* MODALS */}
        {selectedRoom && (
          <AddBooking
            roomData={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onSave={handleAddBooking}
            isOverlapping={isOverlapping}
          />
        )}

        {editBooking && (
          <EditBooking
            bookingData={editBooking}
            onClose={() => setEditBooking(null)}
            onSave={handleEditBooking}
            onDelete={handleDeleteBooking}
            isOverlapping={isOverlapping}
          />
        )}

      </div>
    </div>
  );
}
