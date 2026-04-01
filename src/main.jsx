import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import MyProvider from './Components/context/contextapp.jsx';
import createAppRouter from './Router/router.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';
import '../src/Router/interceptores.jsx'

const router = createAppRouter();

const devSessionKey = "devSessionId";
const currentSessionId = import.meta.env.VITE_DEV_SESSION_ID;
const savedSessionId = localStorage.getItem(devSessionKey);

if (savedSessionId !== currentSessionId) {
  console.log("🧹 ล้าง localStorage เพราะ session ใหม่");
  localStorage.removeItem("accidentFormData");
  localStorage.removeItem("accidentFormDataAcc");
  localStorage.setItem(devSessionKey, currentSessionId);
}

createRoot(document.getElementById('root')).render(
  <MyProvider>
    <Toaster position="bottom-right" reverseOrder={false} />

    <RouterProvider router={router} />
  </MyProvider>
);
