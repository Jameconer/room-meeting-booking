import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { Profile } from "./profile";

export function Navbar({ title = "Meeting Room" }) {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };

        document.addEventListener("mousedown", close);
        window.addEventListener("scroll", close);

        return () => {
            document.removeEventListener("mousedown", close);
            window.removeEventListener("scroll", close);
        };
    }, []);

    return (
        <div className="fixed w-full z-10 flex justify-between items-center bg-[#030697] text-[#f8f8f8] px-8 py-4 shadow-lg">
            <h2 className="text-2xl font-bold tracking-wide">
                {title}
            </h2>

            <div ref={ref} className="relative">

                <button
                    onClick={() => setOpen(!open)}
                    className="w-12 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition text-xl"
                >
                    <FontAwesomeIcon icon={faCircleUser} />
                </button>

                {open && (
                    <div className="absolute right-0 mt-3 z-20">
                        <Profile />
                    </div>
                )}
            </div>

        </div>
    );
}
