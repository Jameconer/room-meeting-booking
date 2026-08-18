// ยูทิลิตี้เกี่ยวกับเวลา ใช้ร่วมกันทุกหน้า (dashboard, checkMeetingRoom, add/editFormBooking)
// รวมมาจากโค้ดที่เดิมเขียนซ้ำในหลายไฟล์

// สร้างรายการเวลาแบบ 15 นาที ตั้งแต่ 00:00 ถึง 23:45
export const generateTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return times;
};

// แปลงข้อความที่พิมพ์ให้อยู่ในรูป HH:MM (เก็บตัวเลขไม่เกิน 4 หลัก)
export const formatTimeInput = (val) => {
  const numbers = val.replace(/\D/g, "").slice(0, 4);
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
};

// ตรวจว่าเป็นเวลารูปแบบ HH:MM ที่ถูกต้อง (00:00 - 23:59)
export const isValidTime = (val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);

// รวมวันที่ + เวลา เป็น "YYYY-MM-DDTHH:MM" (คืนค่าว่างถ้าข้อมูลไม่ครบ/ไม่ถูกต้อง)
export const combineDateTime = (date, time) => {
  if (!date || !time || !isValidTime(time)) return "";
  return `${date}T${time}`;
};
