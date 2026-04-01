import axios from "axios";
import Swal from "sweetalert2";
import { clearAccessToken } from "./token";

const api = axios.create({
    baseURL: "http://192.168.16.203/api",
    withCredentials: true
});

// 👉 axios แยก สำหรับ logout (ไม่ผ่าน interceptor)
const logoutApi = axios.create({
    baseURL: "http://192.168.16.203/api",
    withCredentials: true
});

let handling403 = false;

api.interceptors.response.use(
    res => res,
    async error => {
        if (error.response?.status === 403 && !handling403) {
            handling403 = true;

            await Swal.fire({
                html: `
                    <h2 class="text-lg font-semibold text-red-600 text-center">
                        ไม่มีสิทธิ์เข้าใช้งานระบบ
                    </h2>
                    <p class="text-sm text-gray-700 text-center mt-2">
                        กรุณาเข้าสู่ระบบใหม่
                    </p>
                `,
                icon: "error",
                width: 300,
                confirmButtonText: "ตกลง"
            });

            try {
                // 🔥 เรียก logout API จริง
                await logoutApi.post(import.meta.env.VITE_API_POST_Logout);
            } catch (e) {
                console.warn("Logout API failed:", e);
            }

            // 🧹 เคลียร์ฝั่ง client
            clearAccessToken?.();
            // localStorage.removeItem("token");
            // localStorage.removeItem("email");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
