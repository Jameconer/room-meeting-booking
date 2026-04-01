import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const navigate = useNavigate();

    const handleFocus = () => {
        setShowPlaceholder(false);
    };

    const handleBlur = () => {
        if (email === "") {
            setTimeout(() => setShowPlaceholder(true), 50);
        }
    };

    const handleForgotPass = async () => {
        if (email === "") {
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      กรุณากรอกอีเมลที่ลงท้ายด้วย @sricha.com
    </p>
  `,
                icon: "error",
                width: 300,        // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });
            return;
        }
        if (!email.endsWith("@sricha.com")) {
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      กรุณาใช้อีเมลที่ลงท้ายด้วย @sricha.com
    </p>
  `,
                icon: "error",
                width: 300,        // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });
            return;
        }


        Swal.fire({
            html: `
            <div class="relative flex flex-col items-center justify-center min-h-[200px] bg-white overflow-hidden rounded-xl">
              <!-- Wave Background -->
             <svg class="absolute top-0 left-0 w-full h-full opacity-25"
                    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                    viewBox="0 0 1440 320">
                    <path fill="#000000" fill-opacity="0.2"
                      d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224V0H0Z">
                    </path>
                  </svg>
        
              <!-- Loader + Text -->
              <div class="relative flex flex-col items-center justify-center">
                <div class="swal2-loader !block !relative !m-0"></div>
                <span class="mt-4 text-lg text-gray-700 font-medium">กำลังส่งรหัส OTP...</span>
              </div>
            </div>
          `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            width: 300, // ✅ กำหนดความกว้าง popup
            customClass: {
                popup: "bg-white shadow-lg rounded-xl p-0 overflow-hidden"
            }
        });

        try {

            const res = await axios.post(import.meta.env.VITE_API_POST_ForgotOtp, {
                email: email,   // <== ส่งค่า email ตรงนี้
            },);

            Swal.close();
            Swal.fire({
                showConfirmButton: false,
                timer: 3000,
                width: 300,
                timerProgressBar: true,
                customClass: {
                    popup: "bg-white rounded-xl p-0 shadow-lg overflow-hidden"
                },
                html: `
    <div class="relative flex flex-col items-center justify-center min-h-[180px] overflow-hidden rounded-xl">
      <!-- Wave Background -->
      <svg class="absolute top-0 left-0 w-full h-full opacity-25"
                    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                    viewBox="0 0 1440 320">
                    <path fill="#000000" fill-opacity="0.2"
                      d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,165.3C672,149,768,139,864,144C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224V0H0Z">
                    </path>
                  </svg>
      <!-- Check Icon -->
      <div class="relative flex flex-col items-center justify-center mt-4">
        <svg class="w-12 h-12 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>

        <h2 class="mt-2 text-lg font-medium text-gray-800">สำเร็จ</h2>
        <div class="mt-1 text-gray-600 text-sm text-center">กรุณากรอก OTP ที่ส่งไปยังอีเมล</div>
      </div>
    </div>
  `
            }).then(() => {
                navigate("/forgototp", { state: { email } });
            });

        } catch (err) {
            Swal.close();
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      ${err.response?.data?.message || err.message || "ส่ง OTP ไม่สำเร็จ"}
    </p>
  `,
                icon: "error",
                width: 300,
                confirmButtonText: "ตกลง"
            }).then(() => {
                setEmail("");
                setShowPlaceholder(true)
            });
            console.log(err.response);

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
                    ลืมรหัสผ่าน
                </h2>
                <p className="mb-6 text-sm text-slate-600">กรุณาป้อนอีเมลที่เชื่อมโยงกับบัญชีของคุณ แล้วเราจะส่งรหัสยืนยันเพื่อรีเซ็ตรหัสผ่านให้ทางอีเมล</p>
                {/* Email */}
                <div className="mb-6 relative">
                    <input
                        type="text"
                        id="email"
                        placeholder="@sricha.com"
                        value={email}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer p-3 border border-gray-300 rounded-lg w-full  
                   focus:outline-none placeholder-transparent"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-3 text-gray-600 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                   peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black
                   -top-5 text-sm"
                    >
                        {email === "" && showPlaceholder ? "อีเมล @sricha.com" : "อีเมล"}
                    </label>
                </div>

                {/* Register Button */}
                <button
                    onClick={handleForgotPass}
                    className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
                >
                    ยืนยัน
                </button>
                {/* <button
                    type="submit"
                    className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
                >
                    ยืนยัน
                </button> */}
                {/* Back to Login */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition border"
                >
                    กลับ
                </button>
            </div>
        </div>
    );
}
