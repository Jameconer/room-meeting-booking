import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function ForgotOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 นาที
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);
    useEffect(() => {
        if (!email) {
            // แสดงข้อความสั้น ๆ แล้วไปหน้าสมัคร
            Swal.fire({
                icon: "warning",
                title: "ไม่พบอีเมล",
                text: "กรุณากรอกอีเมลก่อนสมัคร",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                navigate("/login");
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // รันแค่ครั้งแรกตอน mount
    // นับเวลาถอยหลัง
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // ขอ OTP ใหม่
    const handleResendOtp = async () => {
        if (timeLeft > 0) {
            Swal.fire("แจ้งเตือน", "กรุณารอให้เวลาหมดก่อนจึงจะขอ OTP ใหม่ได้", "warning");
            return;
        }

        try {
            Swal.fire({
                title: "กำลังส่ง OTP ใหม่...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await axios.post(import.meta.env.VITE_API_POST_ForgotOtp, {
                email: email,
            });

            Swal.close();
            Swal.fire("สำเร็จ", `รหัส OTP ถูกส่งไปที่ ${email}`, "success");

            setTimeLeft(300); // รีเซ็ตเวลาใหม่
        } catch (err) {
            Swal.close();
            Swal.fire("ผิดพลาด", err.response?.data?.message || "ส่ง OTP ไม่สำเร็จ", "error");
        }
    };

    // handle otp ช่องกรอก
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // รับเฉพาะตัวเลข
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };

    // กดยืนยัน OTP
    const handleConfirm = async () => {
        const otpValue = otp.join("");

        if (!password || !confirmPassword || !otpValue || !email) {
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      กรุณากรอกข้อมูลให้ครบ
    </p>
  `,

                icon: "error",
                width: 300,        // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });

            return;
        }
        if (password !== confirmPassword) {
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      รหัสผ่านไม่ตรงกัน
    </p>
  `,
                icon: "error",
                width: 300,        // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });
            return;
        }

        try {
            Swal.fire({
                html: `
<div class="relative flex flex-col items-center justify-center min-h-[180px] bg-white overflow-hidden rounded-xl">

  <!-- Wave Background -->
  <svg class="absolute top-0 left-0 w-full h-full opacity-25"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    viewBox="0 0 1440 320">
    <path fill="#000000" fill-opacity="0.2"
      d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224V0H0Z">
    </path>
  </svg>

  <!-- Content -->
  <div class="relative flex flex-col items-center justify-center mt-4">

    <!-- 🔄 Spinner -->
    <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

    <!-- Text -->
    <h2 class="mt-3 text-lg font-medium text-gray-800">กำลังตรวจสอบ</h2>
    <div class="mt-1 text-gray-600 text-sm">กำลังตรวจสอบ...</div>

  </div>
</div>
`,
                showConfirmButton: false,
                width: 300, // ✅ กำหนดความกว้าง popup
                timer: 3000,
                customClass: {
                    popup: "bg-white shadow-lg rounded-xl p-0 overflow-hidden"
                }

            });

            const res = await axios.post(import.meta.env.VITE_API_POST_UPdatePass, {
                email: email,
                newpassword: password,
                otp: otpValue,
            });


            Swal.close();
            await Swal.fire({
                html: `
    <div class="relative flex flex-col items-center justify-center min-h-[180px] bg-white overflow-hidden rounded-xl">
      <!-- Wave Background -->
      <svg class="absolute top-0 left-0 w-full h-full opacity-25"
                    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                    viewBox="0 0 1440 320">
                    <path fill="#000000" fill-opacity="0.2"
                      d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224V0H0Z">
                    </path>
                  </svg>

      <!-- Icon + Text -->
      <div class="relative flex flex-col items-center justify-center mt-4">
       <svg class="w-12 h-12 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>

        <h2 class="swal2-title mt-2 text-lg font-medium text-gray-800">สำเร็จ</h2>
        <div class="swal2-html-container mt-1 text-gray-600 text-sm">สมัครสมาชิกเรียบร้อย</div>
      </div>
    </div>
  `,
                width: 300,        // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });
            navigate("/login");

        } catch (err) {
            Swal.close();
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      ${err.response?.data?.message || err.message || "OTP ไม่ถูกต้อง"}
    </p>
  `,
                icon: "error",
                width: 300,
                confirmButtonText: "ตกลง"
            })
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            {/* Background wave */}
            <svg
                className="absolute top-0 left-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                viewBox="0 0 1440 320"
            >
                <path
                    fill="#000000"
                    fillOpacity="0.15"
                    d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
            </svg>
            {/* Card */}
            <div className="relative sm:bg-white p-8 rounded-xl sm:shadow-lg w-full max-w-md z-10">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    ตั้งรหัสผ่านใหม่
                </h2>
                <p className="text-center text-gray-500 mb-4">
                    อีเมล: <span className="font-medium">{email}</span>
                </p>

                {/* Password */}
                <div className="mb-6 relative">
                    <input
                        type="password"
                        id="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer p-3 border border-gray-300 rounded-lg w-full focus:outline-none placeholder-transparent"
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-3 text-gray-600 transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                        peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black -top-5 text-sm">
                        รหัสผ่านใหม่
                    </label>
                </div>

                {/* Confirm Password */}
                <div className="mb-4 relative">
                    <input
                        type="password"
                        id="newpassword"
                        placeholder="ยืนยันรหัสผ่าน"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="peer p-3 border border-gray-300 rounded-lg w-full focus:outline-none placeholder-transparent"
                    />
                    <label
                        htmlFor="newpassword"
                        className="absolute left-3 text-gray-600 transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                        peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black -top-5 text-sm">
                        ยืนยันรหัสผ่านใหม่
                    </label>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    ยืนยัน OTP
                </h2>
                {/* OTP */}
                <div className="flex sm:gap-2 gap-3 justify-center mb-4 relative">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            type="text"
                            placeholder="-"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputsRef.current[i] = el)}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl text-blue-500 font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>

                {/* Resend OTP */}
                <div className="flex w-full justify-center">
                    <p
                        className={`text-center text-sm mb-4 cursor-pointer ${timeLeft === 0
                            ? "text-blue-600 hover:underline"
                            : "text-gray-400"
                            }`}
                        onClick={handleResendOtp}
                    >
                        ขอ OTP ใหม่
                    </p>
                </div>


                {/* Countdown */}
                <p className="text-center text-gray-500 mb-4">
                    เวลาที่เหลือ:{" "}
                    <span className="font-medium text-blue-600">{formatTime()}</span>
                </p>

                <button
                    onClick={handleConfirm}
                    className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition mb-3"
                >
                    ยืนยัน
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full mt-3 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition border"
                >
                    กลับไปเข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
}
