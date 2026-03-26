// auth.js
export function isAuthenticated() {
    return !!localStorage.getItem("token"); // หรืออะไรก็ตามที่ใช้เก็บสถานะ login
}
