import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation} from "react-router-dom"
import './index.css'
import {useEffect} from "react"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import App from './App.jsx'


// Scroll to top every time it mounts 
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // Renders nothing
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer 
        style={{ zIndex: 2147483647  }}   // Higher than Cloudinary widget box
        className="custom-toast-container" 
      />
      <ScrollToTop />
      <App /> 
    </BrowserRouter>
  </StrictMode>,
)
