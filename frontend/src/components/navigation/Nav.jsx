import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from next/navigation
import { Bell, Building2, UserRound } from 'lucide-react';
import Tooltip from './Tooltip'; 
// import Login from "@/components/login/Login" // Keep your login component

const Nav = ({ session }) => {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [active, setActive] = useState('');
    const navigate = useNavigate(); // Standard React Router hook

    useEffect(() => {
        if (active) {
            if (active === "Home") {
                navigate('/');
            } else if (session) {
                // Dynamic routing: /company/123 or /user/123
                navigate(`/${active}/${session.user_id}`);
            }
        }
    }, [active, session, navigate]);

    const handleClick = (stateToActive) => { 
        if (!session) {
            setOpenLoginModal(true);
        } else {
            setActive(stateToActive);
        }
    };

    return (
        <>
            {/* {openLoginModal && <Login {...{setOpenLoginModal, active}}/>} */}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-white/10 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
                    {/* TOP LEFT: HOME */}
                    <div 
                        onClick={() => {
                            setActive('Home');
                        }}
                        className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CareerHub
                    </div>

                    {/* TOP RIGHT: ACTIONS */}
                    <div className="flex items-center gap-3 text-white">
                        <Tooltip name="Company">
                            <button 
                                onClick={() => handleClick("company")}
                                className={`cursor-pointer group w-10 h-10 rounded-full ${active === "company"? "border-purple-500 border-2":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                            >
                                <Building2 className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                    
                        <Tooltip name="Notification">
                            <button 
                                onClick={() => handleClick("notification")}
                                className={`cursor-pointer group w-10 h-10 rounded-full ${active === "notification"? "border-purple-500 border-2" :"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all `}
                            >
                                <Bell className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                        
                        <Tooltip name="Profile">
                            <button 
                                onClick={() => handleClick("user")}
                                className={`overflow-hidden cursor-pointer group w-10 h-10 rounded-full ${active === "user"? "border-purple-500 border-2 ":"bg-white/10 border-white/20"} border flex items-center justify-center hover:bg-purple-500/20 transition-all`}
                            >
                                <UserRound className="w-5 h-5" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Nav;