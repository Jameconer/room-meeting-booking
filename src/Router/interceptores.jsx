import api from "./axiosToken";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

api.interceptors.request.use(config => {
    const token = getAccessToken();


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        // ✅ 1. ข้าม login
        if (originalRequest.url.includes('/login')) {
            return Promise.reject(error);
        }

        // ✅ 2. refresh token fail → กลับ login
        if (originalRequest.url.includes('/authen/refreshtoken')) {
            clearAccessToken();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // ✅ 3. handle 401 ปกติ
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.post('/authen/refreshtoken');
                setAccessToken(res.data.token);

                originalRequest.headers.Authorization =
                    `Bearer ${res.data.token}`;

                return api(originalRequest);
            } catch {
                clearAccessToken();
                window.location.href = '/login'; // 👈 เพิ่มตรงนี้ให้ครบ flow
            }
        }

        return Promise.reject(error);
    }
);
