import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorClosed, faDoorOpen, faCircleUser } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
    const navigate = useNavigate();
    const employeeCode = localStorage.getItem("employeeCode");
    const [hovered, setHovered] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>

            <div className="absolute right-5 top-20  w-72 rounded-xl bg-white p-2 shadow-md shadow-slate-700">
                <div className="bg-[#030697] p-2 rounded-xl  overflow-y-auto pb-5">
                    <div className="grid text-center grid-rows-3">
                        <div className="grid row-span-2 ">
                            <div className="text-center pt-5">
                                <FontAwesomeIcon
                                    icon={faCircleUser}
                                    className="text-7xl cursor-pointer transition-all duration-200 text-white" />
                            </div>
                            <label className="mt-2">{employeeCode}</label>
                        </div>

                        <div className=" flex justify-center items-center ">
                            <div className="bg-[#ffffff] text-[#0d0e0d] cursor-pointer px-8 py-1 flex justify-center items-center gap-2 rounded-xl "
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon
                                    icon={hovered ? faDoorOpen : faDoorClosed}
                                    className=" transition-all duration-200 "
                                />
                                <button>ออกจากระบบ</button>
                            </div>
                            {/* <button className="bg-red-400">dawdaw</button> */}

                        </div>



                    </div>



                    {/* <FontAwesomeIcon
                        icon={hovered ? faDoorOpen : faDoorClosed}
                        className="cursor-pointer transition-all duration-200 text-white"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={handleLogout}
                    /> */}
                </div>

            </div>

        </>
    )
}