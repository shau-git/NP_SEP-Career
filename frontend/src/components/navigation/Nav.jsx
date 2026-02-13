import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Changed from next/navigation
import { Bell, Building2, UserRound } from 'lucide-react';
import Tooltip from './Tooltip'; 
import Login from "../auth/Login" 
import ProfileDropdown from '../auth/ProfileDropdown';

const Nav = ({unreadCount, setFetchCount}) => {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    const [active, setActive] = useState('');
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const profileDropdownRef = useRef(null);

    const navigate = useNavigate(); // Standard React Router hook
    const location = useLocation().pathname.split('/')[1] // (eg: to get 'user' from '/user/40')

    // toogle to the active tab
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (active) {
            // get latest notification when clicking the nav bar
            setFetchCount(true)
            if (active === "Home") {
                navigate('/');
            } else if (currentUser) {
                navigate(`/${active}/${currentUser.user_id}`);
            }
        }
    }, [active]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setOpenProfileDropdown(false);
            }
        };

        if (openProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openProfileDropdown]);


    // click function to navigate to different page (Profile, Company, notification, Home)
    const handleClick = (stateToActive) => { 
        
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token') 
        if (!token || !currentUser) {
            setOpenLoginModal(true);
        } else {
            setToken(token)
            setSession(currentUser)
            if(stateToActive !== "user") {
                setActive(stateToActive);
            } else {
                // open the profile dropdown if is not opened
                !openProfileDropdown && setOpenProfileDropdown(true)
            }
            
        }
    };

    // disable scroll function for the background when the login modal is opened
    useEffect(() => {
        if (openLoginModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openLoginModal]);

    return (
        <>
            {openLoginModal && <Login {...{setOpenLoginModal, active, openLoginModal, setToken, setSession}}/>}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-white/10 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
                    {/* TOP LEFT: HOME */}
                    <div 
                        onClick={() => {
                            setActive('Home');
                        }}
                        className="cursor-pointer text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CareerHub
                    </div>

                    {/* TOP RIGHT: ACTIONS */}
                    <div className="flex items-center gap-3 text-white">
                        <Tooltip name="Company">
                            <button 
                                onClick={() => handleClick("usercompany")}
                                className={`cursor-pointer group w-10 h-10 rounded-full ${token && session && location === "usercompany"? "border-purple-500 border-2":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                            >
                                <Building2 className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                    
                        <div className="relative">
                            <Tooltip name="Notification">
                                <button 
                                    onClick={() => handleClick("notification")}
                                    className={`cursor-pointer group w-10 h-10 rounded-full ${token && session && location === "notification"? "border-purple-500 border-2" :"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                                >
                                    <Bell className="w-4.5 h-4.5" />
                                </button>
                            </Tooltip>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-950">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        
                        <div className="relative" ref={profileDropdownRef}>
                            <Tooltip name="Profile">
                                <button 
                                    onClick={() => handleClick("user")}
                                    className={`overflow-hidden cursor-pointer group w-10 h-10 rounded-full ${token && session && location === "user"? "border-purple-500 border-2 ":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all`}
                                >
                                    <UserRound className="w-5 h-5" />
                                </button>
                            </Tooltip>
                            {openProfileDropdown && <ProfileDropdown {...{setFetchCount, setActive, setOpenProfileDropdown, setToken, setSession}}/>}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Nav;