import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
            <h1 className="text-6xl font-extrabold text-red-600 mb-6">Error 404</h1>
            {error ? (
                <p className="text-xl text-center text-gray-600 mb-6">
                    <b>รายละเอียดข้อผิดพลาด:</b> {error.statusText || error.message || "ไม่ทราบสาเหตุ"}
                </p>
            ) : (
                <p className="text-xl text-center text-gray-600 mb-6">ไม่เจอ path ที่ต้องการ</p>
            )}
            <Link to="/" className="mt-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-300 ease-in-out">
                กลับไปที่หน้าแรก
            </Link>
        </div>
    );
}

export default ErrorPage;