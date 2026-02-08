import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from next/navigation
import { Bell, Building2, UserRound } from 'lucide-react';
import Tooltip from './Tooltip'; 
import Login from "../auth/Login" 
import ProfileDropdown from '../auth/ProfileDropdown';

const Nav = () => {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    const [active, setActive] = useState('');
    const [hasToken, setHasToken] = useState(false)
    const [hasSession, setHasSession] = useState(false)
    const profileDropdownRef = useRef(null);

    const navigate = useNavigate(); // Standard React Router hook

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (active) {
            if (active === "Home") {
                navigate('/');
            } else if (currentUser) {
                active==="user"? 
                (   
                    setOpenProfileDropdown(true)
                ) :(
                    navigate(`/${active}/${currentUser.user_id}`)
                );
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
        setActive(stateToActive);
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!localStorage.getItem('token') || !currentUser) {
            setOpenLoginModal(true);
        } else {
            
            if(stateToActive !== "user") {
                navigate(`/${stateToActive}/${currentUser.user_id}`);
            } else {
                // open the profile dropdown if is not opened
                console.log("ijjk")
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
            {openLoginModal && <Login {...{setOpenLoginModal, active, openLoginModal, setHasToken, setHasSession}}/>}
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
                                className={`cursor-pointer group w-10 h-10 rounded-full ${hasToken && hasSession && active === "company"? "border-purple-500 border-2":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                            >
                                <Building2 className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                    
                        <Tooltip name="Notification">
                            <button 
                                onClick={() => handleClick("notification")}
                                className={`cursor-pointer group w-10 h-10 rounded-full ${hasToken && hasSession && active === "notification"? "border-purple-500 border-2" :"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                            >
                                <Bell className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                        
                        <div className="relative" ref={profileDropdownRef}>
                            <Tooltip name="Profile">
                                <button 
                                    onClick={() => handleClick("user")}
                                    className={`overflow-hidden cursor-pointer group w-10 h-10 rounded-full ${hasToken && hasSession && active === "user"? "border-purple-500 border-2 ":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all`}
                                >
                                    <UserRound className="w-5 h-5" />
                                </button>
                            </Tooltip>
                            {openProfileDropdown && <ProfileDropdown {...{setActive, setOpenProfileDropdown, setHasToken, setHasSession}}/>}
                        </div>
                        
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Nav;