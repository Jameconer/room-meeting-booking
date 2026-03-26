export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4">
        <p className="text-center text-gray-700">{message}</p>
        <div className="flex justify-center gap-4 mt-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}
