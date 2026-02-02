import {useState} from 'react'
import Nav from './components/navigation/Nav';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {Home, User, Company, Notification, JobPost} from "./pages/page_config"
 

// The Layout ensures the Nav is always visible
const Layout = ({ session }) => (
  <>
    <Nav session={session} />
    <div> {/* Offset for the fixed Navbar */}
      	<Outlet /> 
    </div>
  </>
);


const App = () => {
	const [session, setSession] = useState({ user_id: "123", company_id: "456" });
    return (
        <Routes>
            {/* Pass session to Layout so Nav can use it */}
            <Route path="/" element={<Layout session={session} />}>
				<Route index element={<Home />} />
				<Route path="user/:user_id" element={<User />} />
				<Route path="company/:company_id" element={<Company />} />
				<Route path="notification/:user_id" element={<Notification />} />
				<Route path="job_post/:job_post_id" element={<JobPost />} />
            </Route>
        </Routes>
        
    )
}

export default App