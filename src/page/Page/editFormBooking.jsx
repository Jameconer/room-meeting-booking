import { useState, useEffect } from "react";
import Confirm from "../../Components/Laout_component/confirmModal"
import toast from 'react-hot-toast';
import api from "../../Router/axiosToken";

export function EditBooking({ bookingData, onClose, onSave, onDelete, isOverlapping, showStart, setShowStart, showEnd, setShowEnd, times, combineDateTime }) {

  const [showConfirm, setShowConfirm] = useState(false);

  const [user_id, setuser_id] = useState("");

  useEffect(() => {
    api.post(import.meta.env.VITE_API_POST_Me).then((res) => {
      setuser_id(res.data.response.user_id);
    });
  }, []);

  const [form, setForm] = useState({
    id: "",
    room: "",
    room_id: "",
    startDateTime: "",
    endDateTime: "",
    title: "",
    job: "",
    description: "",
    attendee: "",
    create_by: ""
  });

  useEffect(() => {
    if (bookingData && user_id) {
      const booking = bookingData.bookings.find(b => b.id === bookingData.id) || bookingData.bookings[0];

      setForm({
        id: booking.id || "",
        startDateTime: booking.startDateTime || "",
        endDateTime: booking.endDateTime || "",
        title: booking.meeting_title || "",
        job: booking.job || "",
        description: booking.meeting_description || "",
        attendee: booking.attendee_count || "",
        room: bookingData.room || "",
        room_id: bookingData.room_id || "",
        capacity: bookingData.capacity || "",
        create_by: booking.create_by || ""
      });

    }
  }, [bookingData, user_id]); 

  const isOwner = Number(user_id) === Number(form.create_by);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "attendee") {
      if (Number(value) > Number(bookingData.capacity)) {
        toast.error(`จำนวนคนห้ามเกิน ${bookingData.capacity}`);
        return;
      }
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditBooking = async () => {

    if (Number(form.attendee) > Number(bookingData.capacity)) {
      toast.error(`จำนวนคนห้ามเกิน ${bookingData.capacity}`);
      return;
    }

    const start = new Date(form.startDateTime);
    const end = new Date(form.endDateTime);

    if (start >= end) {
      toast.error("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const isConflict = isOverlapping(
      form.startDateTime,
      form.endDateTime,
      bookingData.bookings || [],
      form.id
    );

    if (isConflict) {
      toast.error("ช่วงเวลานี้ถูกจองแล้ว");
      return;
    }

    const start_at = form.startDateTime.replace("T", " ");
    const end_at = form.endDateTime.replace("T", " ");

    const payload = {
      id: form.id,
      room_id: Number(form.room_id),
      start_at,
      end_at,
      meeting_title: form.title,
      meeting_description: form.description,
      job: form.job,
      attendee_count: Number(form.attendee) || 0,
      updated_by: user_id,
      updated_at: new Date().toISOString().slice(0, 19)
    };

    try {
      const res = await fetch(
        "http://192.168.16.203:8090/api/booking/update_booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response error:", text);
        toast.error(`แก้ไขไม่สำเร็จ: ${res.status}`);
        return;
      }

      await res.json();

      toast.success("แก้ไขการจองสำเร็จ");

      onSave({
        ...form,
        attendee: Number(form.attendee) || 0
      });

      onClose();

    } catch (err) {
      console.error("fetch error:", err);
      toast.error("แก้ไขไม่สำเร็จ");
    }
  };

  const deleteBooking = async () => {
    if (!isOwner) {
      toast.error("คุณไม่มีสิทธิ์ลบรายการนี้");
      return;
    }

    try {
      await api.post("http://192.168.16.203:8090/api/booking/delete_booking", {
        id: form.id,
        user_id: user_id
      });

      toast.success("ลบรายการจองสำเร็จ");
      onDelete(form);
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[520px] rounded-2xl shadow-lg border overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            แก้ไขการจอง
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* ห้อง */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">ห้อง</label>
            <input
              value={form.room}
              disabled
              className="w-full border p-2.5 rounded-lg bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">

            {/* START */}
            <div className="space-y-1">
              <label className="block text-sm text-gray-500">เวลาเริ่ม</label>

              <div className="flex items-center gap-2">

                {/* DATE */}
                <input
                  type="date"
                  value={form.startDateTime?.split("T")[0] || ""}
                  onChange={(e) => {
                    const date = e.target.value;
                    const time = form.startDateTime?.split("T")[1] || "";
                    setForm(prev => ({
                      ...prev,
                      startDateTime: combineDateTime(date, time)
                    }));
                  }}
                  disabled={!isOwner}
                  className="flex-1 border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                />

                {/* TIME */}
                <div className="relative w-30">
                  <input
                    type="text"
                    placeholder="ชั่วโมง:นาที"
                    value={form.startDateTime?.split("T")[1] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      let formatted = val;
                      if (val.length > 2) {
                        formatted = `${val.slice(0, 2)}:${val.slice(2)}`;
                      }
                      const date = form.startDateTime?.split("T")[0] || "";
                      setForm(prev => ({
                        ...prev,
                        startDateTime: `${date}T${formatted}`
                      }));
                    }}
                    disabled={!isOwner}
                    className="w-20 border p-2.5 rounded-lg text-center"
                  />

                  {showStart && (
                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-xl shadow">
                      {times
                        .filter(t => t.includes(form.startDateTime?.split("T")[1] || ""))
                        .map(t => (
                          <div
                            key={t}
                            onClick={() => {
                              const date = form.startDateTime?.split("T")[0] || "";
                              setForm(prev => ({
                                ...prev,
                                startDateTime: combineDateTime(date, t)
                              }));
                              setShowStart(false);
                            }}
                            className="px-3 py-2 text-center hover:bg-blue-500 hover:text-white cursor-pointer"
                          >
                            {t}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* END */}
            <div className="space-y-1">
              <label className="block text-sm text-gray-500">เวลาสิ้นสุด</label>

              <div className="flex items-center gap-2">

                {/* DATE */}
                <input
                  type="date"
                  value={form.endDateTime?.split("T")[0] || ""}
                  onChange={(e) => {
                    const date = e.target.value;
                    const time = form.endDateTime?.split("T")[1] || "";
                    setForm(prev => ({
                      ...prev,
                      endDateTime: combineDateTime(date, time)
                    }));
                  }}
                  disabled={!isOwner}
                  className="flex-1 border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                />

                {/* TIME */}
                <div className="relative w-30">
                  <input
                    type="text"
                    placeholder="ชั่วโมง:นาที"
                    value={form.endDateTime?.split("T")[1] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      let formatted = val;
                      if (val.length > 2) {
                        formatted = `${val.slice(0, 2)}:${val.slice(2)}`;
                      }
                      const date = form.endDateTime?.split("T")[0] || "";
                      setForm(prev => ({
                        ...prev,
                        endDateTime: `${date}T${formatted}`
                      }));
                    }}
                    disabled={!isOwner}
                    className="w-20 border p-2.5 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                  />

                  {showEnd && (
                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-xl shadow">
                      {times
                        .filter(t => t.includes(form.endDateTime?.split("T")[1] || ""))
                        .map(t => (
                          <div
                            key={t}
                            onClick={() => {
                              const date = form.endDateTime?.split("T")[0] || "";
                              setForm(prev => ({
                                ...prev,
                                endDateTime: combineDateTime(date, t)
                              }));
                              setShowEnd(false);
                            }}
                            className="px-3 py-2 text-center hover:bg-blue-500 hover:text-white cursor-pointer"
                          >
                            {t}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* title */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">ชื่อการอบรม</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={!isOwner}
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* job */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">แผนก</label>
            <input
              name="job"
              value={form.job}
              onChange={handleChange}
              disabled={!isOwner}
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">ข้อมูลเพิ่มเติม</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!isOwner}
              rows={3}
              className="w-full border p-2.5 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* attendee */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">จำนวนคน</label>
            <input
              type="number"
              name="attendee"
              value={form.attendee}
              onChange={handleChange}
              disabled={!isOwner}
              max={bookingData.capacity}
              onInvalid={(e) => {
                e.target.setCustomValidity(`จำนวนคนต้องไม่เกิน ${bookingData.capacity}`);
              }}
              onInput={(e) => e.target.setCustomValidity("")}
              className="w-full border border-gray-200 p-2.5 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">

          <button
            onClick={deleteBooking}
            disabled={!isOwner}
            className={`px-4 py-2 rounded-xl 
    ${isOwner ? "bg-red-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            ลบ
          </button>

          {
            showConfirm && (
              <Confirm
                message="ต้องการลบรายการจองนี้ใช่ไหม?"
                onCancel={() => setShowConfirm(false)}
                onConfirm={() => {
                  setShowConfirm(false);
                  deleteBooking();
                }}
              />
            )
          }

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleEditBooking}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              บันทึก
            </button>
          </div>

        </div>

      </div>
    </div>

  );
}
