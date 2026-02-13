import Nav from './components/navigation/Nav';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {Home, User, Company, Notification, JobPost, UserCompany, SearchJobs} from "./pages/page_config"
import {useState, useEffect} from "react"
import {getUnreadNotificationCount} from "./utils/fetch_data/fetch_config"



// The Layout ensures the Nav is always visible
const Layout = ({unreadCount, setFetchCount}) => (
    <>
        <Nav {...{unreadCount, setFetchCount}}/>
        <div> {/* Offset for the fixed Navbar */}
            <Outlet className="pt-20"/> 
        </div>
    </>
);


const App = () => {
    // total number of unread notification
    const [unreadCount, setUnreadCount] = useState(0)
    const [fetchCount, setFetchCount] = useState(true)

    useEffect(() => {
        const fetchNotificationCount = async (token) => {
            const response = await getUnreadNotificationCount(token)
            const data = await response.json()
            try {
                if(response.status === 200) {
                    if(data.data != unreadCount) {
                        setUnreadCount(data.data)
                    }
                }
            } catch(error) {
                console.error(error)
            }
        }

        const token = localStorage.getItem('token')
        if(token ) {
            if(fetchCount) {
                fetchNotificationCount(token)
            }
        } else {
            setUnreadCount(0)
        }
        setFetchCount(false)
    },[fetchCount])
    
    return (
        <Routes>
            {/* Pass session to Layout so Nav can use it */}
            <Route path="/" element={<Layout {...{unreadCount, setFetchCount}}/>}>
                <Route index element={<Home {...{unreadCount}}/>} />
                <Route path="user/:user_id" element={<User {...{setFetchCount}}/>} />
                <Route path="usercompany/:user_id" element={<UserCompany {...{setFetchCount}}/>} />
                <Route path="company/:company_id" element={<Company {...{setFetchCount}}/>} />
                <Route path="notification/:user_id" element={<Notification/>} />
                <Route path="job_post/:job_post_id" element={<JobPost {...{setFetchCount}}/>} />
                <Route path="searchjob" element={<SearchJobs {...{setFetchCount}}/>} />
                
                {/* 404 Catch-all Route */}
                <Route path="*" element={<Home/>} />
            </Route>
        </Routes>
        
    )
}

export default App