import {useState} from 'react'
import Nav from './components/navigation/Nav';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {Home, User, Company, Notification} from "./pages/page_config"
 

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
				<Route path="user/:userId" element={<User />} />
				<Route path="company/:companyId" element={<Company />} />
				<Route path="notification/:userId" element={<Notification />} />
            </Route>
          </Routes>
        
    )
}

export default App