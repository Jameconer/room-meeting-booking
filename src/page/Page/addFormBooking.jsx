import { useState, useEffect } from "react";
import Confirm from "../../Components/Laout_component/confirmModal"
import toast from 'react-hot-toast';
import api from "../../Router/axiosToken";

export function AddBooking({ roomData, onClose, onSave, isOverlapping, times, formatTimeInput, showStart, setShowStart, showEnd, setShowEnd, isValidTime }) {
  const [user_id, setuser_id] = useState("");

  const [form, setForm] = useState({
    roomName: roomData.room,
    room_id: roomData.room_id,
    date: roomData.date,
    capacity: roomData.capacity,
    startTime: "",
    endTime: "",
    title: roomData.existing?.title || "",
    job: roomData.existing?.job || "",
    description: roomData.existing?.description || "",
    attendee: roomData.existing?.attendee || "",
    isEditing: roomData.isEditing || false
  });

  useEffect(() => {
    api.post(import.meta.env.VITE_API_POST_Me).then((res) => {
      setuser_id(res.data.response.user_id);
    });

  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const start_at = `${form.date} ${form.startTime}`;
    const end_at = `${form.date} ${form.endTime}`;

    if (new Date(start_at) >= new Date(end_at)) {
      toast.error("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const earliestStart = new Date(`${form.date}T08:00`);
    const latestEnd = new Date(`${form.date}T17:00`);

    if (new Date(start_at) < earliestStart || new Date(end_at) > latestEnd) {
      toast.error("ช่วงเวลาที่สามารถจองได้คือ 08:00 - 17:00");
      return;
    }

    const isConflict = isOverlapping(
      `${form.date}T${form.startTime}`,
      `${form.date}T${form.endTime}`,
      roomData.bookings || []
    );

    if (isConflict) {
      toast.error("ช่วงเวลานี้ถูกจองแล้ว");
      return;
    }

    if (Number(form.attendee) > Number(form.capacity)) {
      toast.error(`จำนวนคนต้องไม่เกิน ${form.capacity} คน`);
      return;
    }

    const payload = {
      room_id: Number(form.room_id),
      start_at,
      end_at,
      meeting_title: form.title,
      meeting_description: form.description,
      job: form.job,
      attendee_count: Number(form.attendee) || 0,
      created_by: user_id
    };

    try {
      const res = await fetch(
        "http://192.168.16.203:8090/api/booking/create_booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response error:", text);
        toast.error(`บันทึกไม่สำเร็จ: ${res.status}`);
        return;
      }

      const result = await res.json();
      console.log("payload sent:", payload);
      console.log("server response:", result);

      toast.success("บันทึกรายการจองสำเร็จ");

      onSave({
        room: form.roomName,
        room_id: Number(form.room_id),
        startDateTime: `${form.date}T${form.startTime}`,
        endDateTime: `${form.date}T${form.endTime}`,
        title: form.title,
        description: form.description,
        job: form.job,
        attendee: Number(form.attendee) || 0,
        id: result?.id
      });

      onClose();
    } catch (err) {
      console.error("fetch error:", err);
      toast.error("บันทึกไม่สำเร็จ");
    }
  };

  const [totalHours, setTotalHours] = useState(0);

  const calculateTotalHours = (start, end) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);
    const startDate = new Date(0, 0, 0, sH, sM);
    const endDate = new Date(0, 0, 0, eH, eM);
    let diff = (endDate - startDate) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  useEffect(() => {
    setTotalHours(calculateTotalHours(form.startTime, form.endTime));
  }, [form.startTime, form.endTime]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] h-[800px] p-6 rounded-2xl shadow-md border border-gray-100 overflow-auto relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md 
  text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {form.isEditing ? "แก้ไขการจอง" : "จองห้องประชุม"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ห้องประชุม */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">ชื่อห้องประชุม</label>
            <input
              value={form.roomName}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-gray-500"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">จำนวนที่รองรับ</label>
            <input
              value={form.capacity}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-gray-500"
            />
          </div>

          {/* วันที่ */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">วันที่</label>
            <input
              value={form.date}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-gray-500"
            />
          </div>

          {/* TIME SHORTCUT BUTTONS */}
          <div className="flex flex-col items-center gap-2 mb-3 text-center">
            {/* ปุ่ม shortcut */}
            <div className="flex gap-2 justify-center w-full">
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, startTime: "08:00", endTime: "12:00" }));
                  setTotalHours(4);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                รอบเช้า
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, startTime: "13:00", endTime: "17:00" }));
                  setTotalHours(4);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                รอบบ่าย
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, startTime: "08:00", endTime: "17:00" }));
                  setTotalHours(9);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                ทั้งวัน
              </button>
            </div>

            {/* เวลารวม */}
            <div className="text-sm text-gray-500 mt-1">
              เวลารวม: <span className="font-medium">{totalHours} ชั่วโมง</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            {/* START */}
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                เวลาเริ่ม <span className="text-emerald-600 text-xs">(กรุณากรอกเวลา)</span>
              </label>

              <input
                value={form.startTime}
                onChange={(e) => {
                  const formatted = formatTimeInput(e.target.value);
                  setForm(prev => ({ ...prev, startTime: formatted }));
                }}
                onFocus={() => setShowStart(true)}
                onBlur={() => {
                  setTimeout(() => setShowStart(false), 150);

                  if (!isValidTime(form.startTime)) {
                    setForm(prev => ({ ...prev, startTime: "" }));
                  }
                }}
                placeholder="ชั่วโมง:นาที"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 
      focus:ring-2 focus:ring-emerald-400 outline-none text-center"
                required
              />

              {showStart && (
                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-xl shadow">
                  {times
                    .filter(t => t.includes(form.startTime))
                    .map(t => (
                      <div
                        key={t}
                        onClick={() => {
                          setForm(prev => ({ ...prev, startTime: t }));
                          setShowStart(false);
                        }}
                        className="px-3 py-2 hover:bg-emerald-500 hover:text-white cursor-pointer"
                      >
                        {t}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* END */}
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                เวลาสิ้นสุด <span className="text-emerald-600 text-xs">(กรุณากรอกเวลา)</span>
              </label>

              <input
                value={form.endTime}
                onChange={(e) => {
                  const formatted = formatTimeInput(e.target.value);
                  setForm(prev => ({ ...prev, endTime: formatted }));
                }}
                onFocus={() => setShowEnd(true)}
                onBlur={() => {
                  setTimeout(() => setShowEnd(false), 150);

                  if (!isValidTime(form.endTime)) {
                    setForm(prev => ({ ...prev, endTime: "" }));
                  }
                }}
                placeholder="ชั่วโมง:นาที"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 
      focus:ring-2 focus:ring-emerald-400 outline-none text-center"
                required
              />

              {showEnd && (
                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-xl shadow">
                  {times
                    .filter(t => t.includes(form.endTime))
                    .map(t => (
                      <div
                        key={t}
                        onClick={() => {
                          setForm(prev => ({ ...prev, endTime: t }));
                          setShowEnd(false);
                        }}
                        className="px-3 py-2 hover:bg-emerald-500 hover:text-white cursor-pointer"
                      >
                        {t}
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>

          {/* ชื่อการอบรม */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">ชื่อการอบรม</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2.5 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* แผนก */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">แผนก</label>
            <input
              name="job"
              value={form.job}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2.5 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">ข้อมูลเพิ่มเติม</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 p-2.5 rounded-lg resize-none 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* attendee */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">จำนวนคน</label>
            <input
              type="number"
              name="attendee"
              value={form.attendee}
              onChange={handleChange}
              max={form.capacity}
              onInvalid={(e) => {
                e.target.setCustomValidity(`จำนวนคนต้องไม่เกิน ${form.capacity}`);
              }}
              onInput={(e) => e.target.setCustomValidity("")}
              className="w-full border border-gray-200 p-2.5 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 
          hover:bg-gray-200 transition"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white 
             hover:bg-emerald-700 transition shadow-sm"
            >
              {form.isEditing ? "บันทึกการแก้ไข" : "บันทึก"}
            </button>
          </div>

        </form>
      </div>
    </div>

  );
}
