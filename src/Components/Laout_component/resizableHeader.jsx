import { useRef } from "react";

export default function ResizableHeader({ width, onResize, children }) {

    const resizerRef = useRef(null);

    const startResize = (e) => {
        const startX = e.clientX;
        const startWidth = width;

        const doDrag = (e) => {
            const newWidth = Math.max(100, startWidth + (e.clientX - startX));
            onResize(newWidth);
        };

        const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
        };

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    return (
        <div className={`w-full h-full relative select-none `}>
            <div className="flex justify-center items-center w-full h-full px-2 py-2 truncate text-center">
                {children}
            </div>
            <div
                ref={resizerRef}
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-gray-400 "
                onMouseDown={startResize}
            />
        </div>
    );
}
