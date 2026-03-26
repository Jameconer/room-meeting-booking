import { useState, useEffect } from "react";
import Confirm from "../../Components/Laout_component/confirmModal"
import toast from 'react-hot-toast';

export function EditBooking({ bookingData, onClose, onSave, onDelete, isOverlapping }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    id: "",
    room: "",
    room_id: "",
    startDateTime: "",
    endDateTime: "",
    title: "",
    job: "",
    description: "",
    attendee: ""
  });

  useEffect(() => {
    if (bookingData) {
      setForm({
        id: bookingData.id || "",
        room: bookingData.room || "",
        room_id: bookingData.room_id || "",
        startDateTime: bookingData.startDateTime || "",
        endDateTime: bookingData.endDateTime || "",
        title: bookingData.title || "",
        job: bookingData.job || "",
        description: bookingData.description || "",
        attendee: bookingData.attendee || ""
      });
    }
  }, [bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditBooking = async () => {
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
      updated_by: 70,
      updated_at: new Date().toISOString()
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
    try {
      const res = await fetch("http://192.168.16.203:8090/api/booking/delete_booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response error:", text);
        toast.error(`ลบไม่สำเร็จ: ${res.status}`);
        return;
      }

      await res.json();
      toast.success("ลบรายการจองสำเร็จ");
      onDelete(form);
      onClose();

    } catch (err) {
      console.error("fetch error:", err);
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

          {/* เวลา */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">เวลาเริ่ม</label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={form.startDateTime?.slice(0, 16) || ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">เวลาสิ้นสุด</label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={form.endDateTime?.slice(0, 16) || ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* title */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">ชื่อการอบรม</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
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
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setShowConfirm(true)}
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
