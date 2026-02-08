import { useState, useEffect, useRef } from 'react';
import { User, LogOut, ChevronDown, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {motion} from "framer-motion"

export default function ProfileDropdown({setActive, setOpenProfileDropdown, setHasToken, setHasSession}) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setHasToken(false)
        setHasSession(false)
        // close log out confirm modal
        setShowLogoutModal(false);
        // close profile drop down
        setOpenProfileDropdown(false);
        // success message
        toast.success('Logged out successfully!');
        setActive("Home")
    };

    const handleViewProfile = () => {
        // Navigate to profile page
        console.log('Navigating to profile...');
        const user = JSON.parse(localStorage.getItem('user'));
        navigate(`/user/${user.user_id}`)
        setOpenProfileDropdown(false);
    };

    return (
        <>
        {/* Profile Dropdown */}
         <div className="relative z-50">
            <div className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                {/* Menu Items */}
                <div className="py-2">
                    <motion.button
                        whileHover={{
                            backgroundColor: "rgba(255,255,255,0.1)"
                        }}
                        onClick={handleViewProfile}
                        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left text-white"
                    >
                        <User className="w-5 h-5 text-purple-400" />
                        <span>View Profile</span>
                    </motion.button>

                    <div className="my-2 border-t border-white/10"></div>

                    <motion.button
                        onClick={() => {
                            setShowLogoutModal(true)
                        }}
                        whileHover={{
                            backgroundColor: "rgba(239,68,68,0.1)"
                        }}
                        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left text-red-300"
                    >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span>Log Out</span>
                    </motion.button>
                </div>
            </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 max-w-md w-full border border-white/20 shadow-2xl animate-scaleIn">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Log Out</h2>
                        </div>
                        <button
                            onClick={() => {setShowLogoutModal(false) ; console.log("clcikA")}}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="mb-6">
                        <p className="text-white/80 leading-relaxed">
                            Are you sure you want to log out? You'll need to sign in again to access your account.
                        </p>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {setShowLogoutModal(false); console.log("Click B")}}
                            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-500/30"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}