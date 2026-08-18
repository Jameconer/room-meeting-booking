import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Appweb() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState({ username: false, password: false });
    const [employeeCode, setEmployeeCode] = useState("");

    useEffect(() => {
        // ตั้ง title ตามภาษา
        document.title = 'RoomMeeting - ระบบจองห้องประชุม';
        // ตั้ง favicon
        const faviconUrl = `${import.meta.env.VITE_IMG_ImgSys}/ACCIDENT-20240822-103918.png`;
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = faviconUrl;

        const oldFavicon = document.querySelector("link[rel='icon']");
        if (oldFavicon) document.head.removeChild(oldFavicon);
        document.head.appendChild(link);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault(); // ป้องกันการ reload หน้า
        if (!employeeCode) return; // ถ้ายังไม่ได้กรอก
        // axios.post(import.meta.env.VITE_APT_POST_Acc, transformedData);
        // ตรวจสอบความถูกต้องของข้อมูล
        // if (username === "a" && password === "1234" || username === "b" && password === "5678") {
        localStorage.setItem("token", "dummy-token");
        localStorage.setItem("employeeCode", employeeCode);
        navigate("/List_RoomMeeting");
        // navigate("/accident", "/edit", { state: { employeeCode } });

        // } else {
        //     setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง");
        //     setInputError({ username: true, password: true });
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen  bg-[#075322] pt-20 pb-10 sm:px-5 ">
            <div className="sm:flex items-center justify-center  bg-[#ffd481] rounded-lg sm:shadow-lg sm:shadow-slate-800">
                <div className="relative sm:max-w-lg  items-center hidden  sm:flex">
                    <div className="relative z-0 ">
                        <img src={`${import.meta.env.VITE_IMG_ImgSys}/Artboard 4.png`} />
                    </div>
                    <div className=" absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <img src={`${import.meta.env.VITE_IMG_ImgSys}/Ambulance (GIF).gif`} className="w-64" />
                    </div>
                </div>
                <div className="relative sm:w-full w-[80%] sm:h-auto sm:max-w-sm  ">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/4 sm:-translate-x-1/2 -translate-y-1/2 z-10">
                        <img
                            src={`${import.meta.env.VITE_IMG_ImgSys}/ACCIDENT-20240822-103918.png`}
                            className="h-36 bg-white rounded-full "
                        />
                    </div>


                    <div className="bg-white w-96 items-center flex justify-center rounded-lg  h-96  relative z-0">


                        <form onSubmit={handleLogin} className=" w-full px-10">

                            {/* <div className="mb-4">
                                <label className="block mb-1 font-medium">ชื่อผู้ใช้</label>
                                <input
                                    type="text"
                                    value={username}
                                    placeholder="ไม่ต้องกรอกชื่อผู้ใช้"
                                    disabled
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setInputError({ ...inputError, username: false });
                                    }}
                                    className={`w-full  px-3 py-2 border rounded-md focus:outline-none focus:ring ${inputError.username ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-blue-300"
                                        }`}
                                    required
                                />
                            </div> */}
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">รหัสพนักงาน</label>
                                <input
                                    type="text"
                                    value={employeeCode}
                                    placeholder="กรอกรหัสพนักงาน"
                                    onChange={(e) => setEmployeeCode(e.target.value)}
                                    className={`w-full  px-3 py-2 border rounded-md focus:outline-none focus:ring `}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    placeholder="ไม่ต้องกรอกรหัสผ่าน"
                                    value={password}
                                    disabled
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setInputError({ ...inputError, password: false });
                                    }}
                                    className={`bg-gray-200 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${inputError.password ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-blue-300"
                                        }`}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-[#075322] text-white py-2 rounded-md hover:bg-[#163b23] "
                            >
                                เข้าสู่ระบบ
                            </button>

                            <div className="flex justify-center text-slate-600 pt-2">
                                {/* <label>ID : a </label>
                                <label>Pass : 1234</label> */}
                                <label>* เข้าสู่ระบบได้เลย *</label>
                            </div>

                        </form>

                    </div>

                </div>
            </div>



        </div>
    );
}

export default Appweb;
