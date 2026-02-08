import Nav from './components/navigation/Nav';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {Home, User, Company, Notification, JobPost, UserCompany} from "./pages/page_config"
 

// The Layout ensures the Nav is always visible
const Layout = () => (
  <>
    <Nav/>
    <div> {/* Offset for the fixed Navbar */}
      	<Outlet className="pt-20"/> 
    </div>
  </>
);


const App = () => {
    return (
        <Routes>
            {/* Pass session to Layout so Nav can use it */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="user/:user_id" element={<User />} />
              <Route path="usercompany/:user_id" element={<UserCompany />} />
              <Route path="company/:company_id" element={<Company />} />
              <Route path="notification/:user_id" element={<Notification />} />
              <Route path="job_post/:job_post_id" element={<JobPost />} />
            
              {/* 404 Catch-all Route */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Route>
        </Routes>
        
    )
}

export default App