import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

export function Calendar({ open, onClose, bookings }) {

  const calendarRef = useRef(null);

  const goToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  if (!open) return null;

  const today = dayjs().locale("th").format("D MMMM YYYY");

  const events = bookings.map(b => ({
    title: `${b.room} | ${b.employee}`,
    start: `${b.date}T${b.startTime}`,
    end: `${b.date}T${b.endTime}`,
    backgroundColor: "#10b981",
    borderColor: "#059669"
  }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-6xl p-6 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              ปฏิทินการจองห้องประชุม
            </h2>
            <p className="text-sm text-slate-500">
              จัดการการจองห้องประชุมทั้งหมด
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Today Banner */}
        <div className="mb-4 flex justify-between items-center bg-slate-100 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={goToday}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-slate-700 rounded-lg shadow hover:bg-yellow-200 hover:scale-105 transition text-md font-semibold leading-none"
            >
              <FontAwesomeIcon icon={faCalendarDay} className="text-sm" />
              วันนี้
            </button>
            <span className="flex items-center text-sm font-medium text-slate-700">
              :
              <span className="ml-2 font-semibold text-slate-700 ">
                {today}
              </span>
            </span>
          </div>
          <span className="text-xs text-slate-500">
            คลิก event เพื่อดูรายละเอียด
          </span>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="th"
            height="70vh"
            titleFormat={{
              year: "numeric",
              month: "long"
            }}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            buttonText={{
              month: "เดือน",
              week: "สัปดาห์",
              day: "วัน"
            }}
            events={events}
            eventDisplay="block"
          />
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600">
              การจองห้องประชุม
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
