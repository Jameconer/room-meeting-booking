import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, KeyRound, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../Router/axiosToken";
import { clearAccessToken } from "../../Router/token";

export function Logout() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const [email, setEmail] = useState("");
    const username = email?.split?.("@")?.[0] || "";


    // ✅ ดึงข้อมูลผู้ใช้จาก API และเก็บใน localStorage
    useEffect(() => {
        api.post(import.meta.env.VITE_API_POST_Me).then((res) => {
            setEmail(res.data.response.email);
            localStorage.setItem("user_id", res.data.response.user_id);
            localStorage.setItem("email", res.data.response.email);
        });

    }, []);


    const handleLogout = async () => {
        setOpen(false);

        try {
            // 🔴 เรียก API logout
            await api.post(import.meta.env.VITE_API_POST_Logout);

        } catch (err) {
            // ⚠️ ถ้า logout API error ไม่ต้อง block user
            console.warn("Logout API failed:", err);
        } finally {
            // ✅ เคลียร์ฝั่ง client เสมอ
            Swal.fire({
                html: `
            <div class="relative flex flex-col items-center justify-center min-h-[180px] bg-white overflow-hidden rounded-xl">
                <svg class="absolute top-0 left-0 w-full h-full opacity-25"
                    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                    viewBox="0 0 1440 320">
                    <path fill="#000000" fill-opacity="0.2"
                        d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224V0H0Z">
                    </path>
                </svg>

                <div class="relative flex flex-col items-center justify-center mt-4">
                    <svg class="w-12 h-12 text-red-500"
                        viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>

                    <h2 class="swal2-title mt-2 text-lg font-medium text-gray-800">
                        ออกจากระบบสำเร็จ
                    </h2>
                    <div class="swal2-html-container mt-1 text-gray-600 text-sm">
                        กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...
                    </div>
                </div>
            </div>
            `,
                showConfirmButton: false,
                timer: 1200,
                width: 300,
                timerProgressBar: true,
                customClass: {
                    popup: "bg-white rounded-xl p-0 shadow-lg overflow-hidden"
                },
                didClose: () => {
                    localStorage.removeItem("token");
                    clearAccessToken();
                    navigate("/login");
                }
            });
        }
    };

    const MenuItem = ({ icon, text, onClick }) => (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
            <span className="text-gray-500">{icon}</span>
            {text}
        </button>
    )


    // ✅ ปิด dropdown เมื่อคลิกนอกพื้นที่
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* ปุ่มโปรไฟล์ */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-100 shadow-sm transition"
            >
                <User className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700 hidden sm:inline">
                    {username}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                        <p className="font-semibold">{"ผู้ใช้ทั่วไป"}</p>
                        <p className="text-xs text-gray-400">{email}</p>
                    </div>

                    <div className="py-1">
                        {/* <MenuItem
                            icon={<UserCircle className="w-4 h-4" />}
                            text="ข้อมูลส่วนตัว"
                            onClick={() => navigate("/profile")}
                        /> */}

                        <MenuItem
                            icon={<KeyRound className="w-4 h-4" />}
                            text="เปลี่ยนรหัสผ่าน"
                            onClick={() => navigate("/forgot")}
                        />

                        {/* <MenuItem
                            icon={<Settings className="w-4 h-4" />}
                            text="การตั้งค่า"
                            onClick={() => navigate("/settings")}
                        />

                        <MenuItem
                            icon={<HelpCircle className="w-4 h-4" />}
                            text="ช่วยเหลือ / ติดต่อ"
                            onClick={() => navigate("/help")}
                        /> */}
                    </div>

                    <hr className="my-1" />

                    {/* Logout */}

                    <button
                        onClick={handleLogout}
                        className="flex  items-center w-full gap-3 px-4 py-2 text-sm text-red-400  hover:bg-red-50 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                    </button>
                </div>
            )}
        </div>
    );
}
