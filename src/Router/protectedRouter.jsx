import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import api from "./axiosToken";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

export default function ProtectedRoute() {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        let mounted = true;

        const check = async () => {
            try {
                let token = getAccessToken();


                if (!token) {
                    // พยายามแลก token จาก httpOnly refresh cookie
                    const res = await api.post('/authen/refreshtoken');
                    token = res.data?.token;
                    if (token) {
                        setAccessToken(token);
                    } else {
                        // ถ้า backend ไม่คืน token ให้ถือว่า refresh ล้ม
                        throw new Error('no-token-from-refresh');
                    }
                }

                // (ถ้าต้อง verify เพิ่มเติม ให้เรียก /me ที่นี่ — แต่ไม่บังคับ)
                if (mounted) setAuthed(true);
            } catch (err) {
                clearAccessToken();
                if (mounted) setAuthed(false);
            } finally {
                if (mounted) setChecking(false);
            }
        };

        check();
        return () => { mounted = false; };
    }, []);

    if (checking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!authed) return <Navigate to="/login" replace />;
    return <Outlet />;
}