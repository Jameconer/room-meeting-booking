// ที่อยู่ API ส่วนกลาง
// เดิม URL ของ backend ถูก hardcode กระจายอยู่หลายไฟล์ (dashboard, checkMeetingRoom, add/editFormBooking, axiosToken)
// ย้ายมารวมไว้ที่เดียว ตั้งค่าได้ผ่าน env VITE_API_BASE (ถ้าไม่ตั้งจะใช้ค่าเดิมเป็น fallback)
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://192.168.16.203:8090";

// endpoint ของระบบจองห้องประชุม
export const BOOKING_API = {
  getRooms: `${API_BASE}/api/booking/get_meeting_rooms_booking`,
  create: `${API_BASE}/api/booking/create_booking`,
  update: `${API_BASE}/api/booking/update_booking`,
  remove: `${API_BASE}/api/booking/delete_booking`,
  fileByPath: `${API_BASE}/api/file/getfilebypath`,
  saveVisits: `${API_BASE}/api/intranet/savevisits`,
};
