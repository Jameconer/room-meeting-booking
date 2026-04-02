import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useFilter } from "../designobject/filterContext";
import { setAccessToken } from "../../Router/token";
import api from "../../Router/axiosToken";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const navigate = useNavigate();

    const handleFocus = () => setShowPlaceholder(false);
    const handleBlur = () => {
        if (email === "") setTimeout(() => setShowPlaceholder(true), 50);
    };
    useEffect(() => {
        // ตั้ง title
        document.title = "IMSPRO R&D Login";

        // ตั้ง favicon
        const faviconUrl = `${import.meta.env.VITE_IMG_ImgSys}/R&D Logo.png`;
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = faviconUrl;

        const oldFavicon = document.querySelector("link[rel='icon']");
        if (oldFavicon) document.head.removeChild(oldFavicon);
        document.head.appendChild(link);
    }, []); // รันใหม่ถ้า language เปลี่ยน

    const handleLogin = async () => {
        let finalEmail = email.trim();
        if (!finalEmail.includes("@")) {
            finalEmail = finalEmail + "@sricha.com";
        }
        if (!finalEmail || !password) {
            Swal.fire({
                html: `
                 
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">กรุณากรอกอีเมลและรหัสผ่าน</p>
  `,
                icon: "error",
                width: 300,
                // กำหนดความกว้างเป็น 300px
                confirmButtonText: "ตกลง"
            });
            return;
        }

        try {

            // 1️⃣ login
            const res = await api.post(import.meta.env.VITE_API_POST_Login, {
                email: finalEmail,
                password: password,

            },


                {
                    skipAuth: true // 👈 เพิ่ม
                });

            // ถ้า auth ผ่าน
            Swal.close();

            Swal.fire({
                html: `
                <div class="relative flex flex-col items-center justify-center min-h-[180px] bg-white overflow-hidden rounded-xl">
                  
                  <!-- Wave Background (Dark Gray) -->
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
                    <h2 class="swal2-title mt-2 text-lg font-medium text-gray-800">เข้าสู่ระบบสำเร็จ</h2>
                    <div class="swal2-html-container mt-1 text-gray-600 text-sm">กำลังนำคุณเข้าสู่ระบบ...</div>
                  </div>
                </div>
              `,
                showConfirmButton: false,
                timer: 1000,
                width: 300,
                timerProgressBar: true,
                didClose: () => {
                    setAccessToken(res.data.token);
                    localStorage.setItem("token", res.data.token);
                    // ดึงข้อมูลผู้ใช้
                    api.post(import.meta.env.VITE_API_POST_Me).then((meRes) => {
                        localStorage.setItem("user_id", meRes.data.response.user_id);
                        localStorage.setItem("email", meRes.data.response.email);
                    }).catch((err) => console.warn("Failed to fetch user info:", err));
                    // console.log(res.data.token);
                    navigate(`/List_RoomMeeting`);


                },
                customClass: {
                    popup: "bg-white rounded-xl p-0 shadow-lg overflow-hidden"
                }
            });
        } catch (err) {
            Swal.close();
            Swal.fire({
                html: `
    <h2 class="text-lg font-semibold text-red-600 text-center">ผิดพลาด</h2>
    <p class="text-sm text-gray-700 text-center mt-2">
      ${err.response?.data?.message || err.message || "เข้าสู่ระบบไม่สำเร็จ"}
    </p>
  `,
                icon: "error",
                width: 300,
                confirmButtonText: "ตกลง"
            });
        }
    };

    const handleRegister = () => {
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
    <h2 class="mt-3 text-lg font-medium text-gray-800">กำลังโหลด</h2>
    <div class="mt-1 text-gray-600 text-sm">กำลังโหลด...</div>

  </div>
</div>
  `,
            showConfirmButton: false,
            // allowOutsideClick: false,
            // didOpen: () => {
            //     Swal.showLoading();
            // },
            width: 300, // ✅ กำหนดความกว้าง popup
            customClass: {
                popup: "bg-white shadow-lg rounded-xl p-0 overflow-hidden"
            }
        });

        setTimeout(() => {
            Swal.close();
            navigate("/reg");
        }, 700);
    };
    const handleForgotPass = () => {
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
    <h2 class="mt-3 text-lg font-medium text-gray-800">กำลังโหลด</h2>
    <div class="mt-1 text-gray-600 text-sm">กำลังโหลด...</div>

  </div>
</div>
`,
            showConfirmButton: false,
            width: 300, // ✅ กำหนดความกว้าง popup
            customClass: {
                popup: "bg-white shadow-lg rounded-xl p-0 overflow-hidden"
            }
        });

        setTimeout(() => {
            Swal.close();
            navigate("/forgot");
        }, 700);
    };

    const handleOpenFileSafely = () => {
        // if (loading) {
        //     Swal.fire({
        //         icon: "info",
        //         title: "กำลังโหลด...",
        //         text: "กรุณารอสักครู่",
        //     });
        //     return;
        // }

        const fileIso = "login IMS Smartboard.pdf"
        // console.log(fileIso);
        const subarg = "Other"
        // if (!images || images.length === 0) {
        //     Swal.fire({
        //         icon: "warning",
        //         title: lang_keyword("Please wait"),
        //         text: lang_keyword("Loading files, please try again in a moment."),
        //     });
        //     return;
        // }
        const basePath = `${import.meta.env.VITE_IMG_Utility}/${subarg}`;
        const fullUrl = `${basePath}/${fileIso}`;
        // console.log(fullUrl);
        window.open(fullUrl, '_blank');
        // const folder1 = images.find(folder => folder.name === "UploadFile");
        // const folder2 = folder1?.children?.find(sub => sub.name === "Utility");
        // const folder3 = folder2?.children?.find(sub => sub.name === subarg);
        // console.log(folder3);

        // // const folder3 = folder2?.children?.find(item => item.name === subarg);

        // const fileExists = folder3?.children?.some(child => child.name === fileIso);

        // if (fileExists) {
        //     window.open(fullUrl, '_blank');
        //     // console.log(fullUrl);

        // } else {
        //     Swal.fire({
        //         icon: "error",
        //         title: lang_keyword("File Not Found"),
        //         text: lang_keyword("This file does not exist in the system."),
        //     });
        // }
    };
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#f4f4f4] overflow-hidden">
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
            {/* พื้นหลังลายเฉียงสีดำบาง ๆ ให้เข้ากับสไตล์โลโก้ */}
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(135deg,#000_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md z-10 border border-gray-200">

                {/* LOGO */}
                <div className="flex justify-center mb-6">
                    <img
                        src={`${import.meta.env.VITE_IMG_ImgSys}/R&D Logo.png`}
                        alt="logo"
                        className="h-32 w-auto"
                    />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // 👈 เพิ่มตัวนี้
                        handleLogin();
                    }}
                >
                    {/* Email */}
                    <div className="mb-6 relative ">
                        <input
                            type="text"
                            id="email"
                            placeholder="@sricha.com"
                            value={email}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer p-3 border border-gray-400 rounded-md w-full focus:outline-none focus:border-black placeholder-transparent"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-3 text-gray-600 transition-all
                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                            peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black
                            -top-5 text-sm"
                        >
                            {email === "" && showPlaceholder ? "อีเมล ( ไม่มี @sricha.com ก็ได้ )" : "อีเมล"}
                        </label>
                    </div>

                    {/* Password */}
                    <div className="mb-6 relative">
                        <input
                            type="password"
                            placeholder="รหัสผ่าน"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer p-3 border border-gray-400 rounded-md w-full focus:outline-none focus:border-black placeholder-transparent"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-3 text-gray-600 transition-all
                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                            peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black
                            -top-5 text-sm"
                        >
                            รหัสผ่าน
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition "
                    >
                        เข้าสู่ระบบ
                    </button>
                    <div>
                        <div className="flex justify-between mt-3 text-sm">
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="text-blue-500 underline hover:text-blue-600 transition"
                            >
                                สมัครสมาชิก
                            </button>
                            <button
                                type="button"
                                onClick={handleForgotPass}
                                className="text-blue-500 underline hover:text-blue-600 transition"
                            >
                                ลืมรหัสผ่าน ?
                            </button>

                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleOpenFileSafely} type="button" className="text-sm text-blue-500 underline hover:text-blue-600 transition">
                                คู่มือ
                            </button>
                        </div>

                    </div>

                </form>

            </div>
        </div>

    );
}
