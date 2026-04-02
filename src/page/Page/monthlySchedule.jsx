export function MonthlySchedule({
  data,
  currentDate,
  changeMonth,
  goToToday,
  tableRef,
  displayRooms,
  setActiveTab,
  activeTab,
  roomFilter,
  setRoomFilter,
  filteredRooms,
  onCellClick,
  onEditBooking,
  rowRefs,
  useState 
}) {

  const monthLabel = new Date(
    currentDate.year,
    currentDate.month
  ).toLocaleString("th-TH", {
    month: "long",
    year: "numeric"
  });

  // COLOR SYSTEM
  const roomColors = [
    {
      header: "bg-blue-200 text-blue-900",
      cell: "bg-blue-50",
      block: "bg-blue-400 hover:bg-blue-500"
    },
    {
      header: "bg-green-200 text-green-900",
      cell: "bg-green-50",
      block: "bg-green-400 hover:bg-green-500"
    },
    {
      header: "bg-purple-200 text-purple-900",
      cell: "bg-purple-50",
      block: "bg-purple-400 hover:bg-purple-500"
    },
    {
      header: "bg-orange-200 text-orange-900",
      cell: "bg-orange-50",
      block: "bg-orange-400 hover:bg-orange-500"
    },
    {
      header: "bg-pink-200 text-pink-900",
      cell: "bg-pink-50",
      block: "bg-pink-400 hover:bg-pink-500"
    },
    {
      header: "bg-yellow-200 text-yellow-900",
      cell: "bg-yellow-50",
      block: "bg-yellow-400 hover:bg-yellow-500"
    }
  ];

  const getRoomTheme = (index) => {
    return roomColors[index % roomColors.length];
  };

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });

  const roomsToShow = roomFilter ? filteredRooms : displayRooms;

  const today = new Date();

  const now = new Date();

  const isCurrentMonth =
    currentDate.month === now.getMonth() &&
    currentDate.year === now.getFullYear();

  const isFutureMonth =
    currentDate.year > now.getFullYear() ||
    (currentDate.year === now.getFullYear() &&
      currentDate.month > now.getMonth());

  const isPastMonth =
    currentDate.year < now.getFullYear() ||
    (currentDate.year === now.getFullYear() &&
      currentDate.month < now.getMonth());

  const convertToPercent = (datetime) => {
    if (!datetime) return 0;

    const dateObj = new Date(datetime);
    const totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();

    const startDay = 8 * 60;
    const endDay = 17 * 60;

    return ((totalMinutes - startDay) / (endDay - startDay)) * 100;
  };

  // รับ theme เข้ามา
  const renderTimeBlocks = (bookings = [], room, day) => {
    return (
      <div className="relative h-[40px] bg-black/5 rounded overflow-hidden">

        {/* timeline grid */}
        <div className="absolute inset-0 grid grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-r border-black/20" />
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-[11px] italic">
            {/* ว่าง */}
          </div>
        )}

        {bookings.map((b, i) => {
          const left = convertToPercent(b.startDateTime);
          const right = convertToPercent(b.endDateTime);
          const width = right - left;
          const showText = width > 20;

          const startTime = new Date(b.startDateTime).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });

          const endTime = new Date(b.endDateTime).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });

          return (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();

                if (isPastMonth) return;

                onEditBooking({
                  ...b,
                  room,
                  date: new Date(b.startDateTime).toISOString().split("T")[0]
                });
              }}

              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  visible: true,
                  x: rect.left + rect.width / 2,
                  y: rect.top - 8,
                  data: b
                });
              }}
              onMouseLeave={() => {
                setTooltip({ visible: false, x: 0, y: 0, data: null });
              }}
              className="absolute z-20 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: "40px"
              }}
            >
              <div
                className={`h-[20px] flex items-center justify-center
                bg-gradient-to-r from-red-400 to-red-500
                text-white text-[14px] font-semibold
                rounded-xl px-2 shadow-lg
                hover:scale-[1.05] hover:shadow-xl
                transition-all duration-200
                overflow-hidden whitespace-nowrap text-ellipsis`}
              >
                {showText ? `${startTime} - ${endTime}` : ""}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">

      {/* HEADER */}
      <div className="p-2 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-2">

        <div className="flex items-center gap-2 flex-wrap">

          <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-gray-200 rounded">◀</button>

          <span className="font-semibold text-sm text-gray-700">
            {monthLabel}
          </span>

          <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-gray-200 rounded">▶</button>

          <button onClick={goToToday} className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded">
            วันนี้
          </button>

          {/* TAB */}
          <div className="flex gap-2 ml-3">
            {["all", "training", "meeting"].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setRoomFilter("");
                }}
                className={`px-3 py-1 rounded text-sm ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {tab === "all" ? "ทั้งหมด" : tab === "training" ? "ห้องอบรม" : "ห้องประชุม"}
              </button>
            ))}
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-2 ml-3">
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="border p-1 rounded text-sm"
            >
              <option value="">ทั้งหมด</option>
              {displayRooms.map((room, idx) => (
                <option key={`${room}-${idx}`} value={room}>{room}</option>
              ))}
            </select>

            <button onClick={() => setRoomFilter("")} className="text-xs text-blue-500">
              ล้าง
            </button>
          </div>

        </div>

        <div className="text-xs text-gray-500">
          ช่วงเวลาที่จอง: 08:00 - 17:00
        </div>
      </div>

      {/* TABLE */}
      <div ref={tableRef} className="flex-1 overflow-auto">

        <table className="w-full table-fixed border-collapse">

          <thead>
            <tr>
              <th className="border w-[40px]">วันที่</th>

              {roomsToShow.map((room, index) => {
                const theme = getRoomTheme(index);

                return (
                  <th
                    key={`${room}-${index}`}
                    className={`border min-w-[140px] ${theme.header}`}
                  >
                    {room}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => {

              const isToday =
                today.getDate() === row.day &&
                today.getMonth() === currentDate.month &&
                today.getFullYear() === currentDate.year;

              return (
                <tr
                  key={row.day}
                  ref={(el) => (rowRefs.current[row.day] = el)}
                >

                  <td
                    className={`border text-center font-semibold relative
                      ${isToday}
                    `}
                  >
                    {row.day}

                    {isToday && (
                      <span className="absolute top-1 right-1 text-[10px] px-1.5 py-[1px] bg-red-500 text-white rounded">
                        วันนี้
                      </span>
                    )}
                  </td>

                  {roomsToShow.map((room, index) => {
                    const allBookings = row.rooms[room] || [];

                    const bookings = allBookings.filter(b => {
                      const bookingDate = new Date(b.startDateTime);
                      return (
                        bookingDate.getFullYear() === currentDate.year &&
                        bookingDate.getMonth() === currentDate.month &&
                        bookingDate.getDate() === row.day
                      );
                    });

                    const theme = getRoomTheme(index);

                    return (
                      <td
                        key={room}
                        onClick={() => {
                          if (!isCurrentMonth) return;
                          onCellClick({ room, day: row.day });
                        }}
                        className={`relative border p-[2px] overflow-hidden 
                          ${theme.cell} 
                          ${isCurrentMonth ? "cursor-pointer" : "cursor-default"}
                        `}
                        title={
                          isFutureMonth
                            ? "ยังไม่เปิดให้จองล่วงหน้า"
                            : isPastMonth
                              ? "ไม่สามารถจองย้อนหลังได้"
                              : ""
                        }
                      >

                        {isToday && (
                          <div className="absolute inset-0 bg-red-200/30 pointer-events-none"></div>
                        )}

                        {renderTimeBlocks(bookings, room, row.day)}

                        {isFutureMonth && (
                          <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center text-[12px] text-gray-500 font-semibold">
                            🔒 ยังไม่เปิดจอง
                          </div>
                        )}
                      </td>

                    );
                  })}
                </tr>
              );
            })}
          </tbody>

        </table>

        {tooltip.visible && (
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)"
            }}
          >
            <div className="bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap text-center">

              <div className="font-semibold text-sm">
                {new Date(tooltip.data.startDateTime).toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}

                {"-"}

                {new Date(tooltip.data.endDateTime).toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </div>

              {tooltip.data.job && (
                <div className="text-gray-300">
                  {tooltip.data.job} : {tooltip.data.meeting_title}
                </div>
              )}

              {tooltip.data.people && (
                <div className="text-gray-400 text-[11px]">
                  👥 {tooltip.data.people} คน
                </div>
              )}

              {/* ลูกศร */}
              <div className="w-3 h-3 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 top-full"></div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
