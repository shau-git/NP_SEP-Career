import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider, BrowserRouter} from "react-router-dom"
import './index.css'
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer 
        style={{ zIndex: 2147483647  }}   // Higher than Cloudinary widget box
        className="custom-toast-container" 
      />
      <App /> 
    </BrowserRouter>
  </StrictMode>,
)
