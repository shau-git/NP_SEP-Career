import {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
import {toast} from "react-toastify"
import {authUser} from "../../utils/fetch_data/fetch_config"
import { useNavigate , useParams} from 'react-router-dom';

import { Mail, Lock, Eye, EyeOff, X, Github, Chromium } from 'lucide-react';


const Login = ({setOpenLoginModal, active, setToken, setSession}) => {
    const navigate = useNavigate();

    const [isMobileHeight, setMobileHeigt] = useState(false)
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && token ) { 
            if(active){
                navigate(`/${active}/${currentUser.user_id}`);
            }
            setOpenLoginModal(false);
        }
    }, [active])


    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // adjusting the modal to fit smaller screen
    useEffect(() => {
        const checkHeight = () => {
            let mediaQuery = window.innerHeight < 890//877;  //739
            if(isLogin) {
                mediaQuery = window.innerHeight < 739;
            }
            setMobileHeigt(mediaQuery);
        }
        checkHeight()

        window.addEventListener('resize', checkHeight);
        return () => window.removeEventListener('resize', checkHeight);
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 5) {
            newErrors.password = 'Password must be at least 5 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const reqbody = {email: formData.email, password: formData.password}
                !isLogin && (reqbody.name = formData.name)

                const field = isLogin ? "login" : "user"

                const response = await authUser(field, reqbody)
                const data = await response.json()

                if((isLogin && response.status === 200) || (!isLogin && response.status === 201)) {
                    const user_id = data.user.user_id
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    setToken(localStorage.getItem('token'))
                    setSession(JSON.parse(localStorage.getItem('user')))
                    toast.success( data.message || "Sucessfully Logged In.")
                    setOpenLoginModal(false)
                    if(active) {
                        navigate(`/${active}/${user_id}`);
                    }
                } else {
                    toast.error(data.message)
                }
            } catch(error) {
                toast.error(error)
            }
            
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
    };

    return (
        <motion.div
            className={`max-h-screen z-20 fixed inset-0 bg-slate-950/80 backdrop-blur-md flex ${isMobileHeight?"items-start":"items-center"} justify-center p-4 overflow-y-scroll`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Modal Container */}
            <motion.div
                className=" z-30 relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 max-w-sm w-full border border-white/20 shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={() => setOpenLoginModal(false)}
                    className="cursor-pointer absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
                >
                    <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </button>

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        CareerHub
                    </h1>
                    <p className="text-white/60">
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`cursor-pointer flex-1 py-2 rounded-lg font-semibold transition-all ${
                        isLogin
                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white/80'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`cursor-pointer flex-1 py-2 rounded-lg font-semibold transition-all ${
                        !isLogin
                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white/80'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5 mb-6">
                    {/* Name Field (Register Only) */}
                    {!isLogin && (
                        <div>
                        <label className="block text-white/80 font-medium mb-2 text-sm">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full bg-white/5 border ${
                            errors.name ? 'border-red-500/50' : 'border-white/20'
                            } rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all`}
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>
                        )}
                        </div>
                    )}
                

                    {/* Email Field */}
                    <div>
                        <label className="block text-white/80 font-medium mb-2 text-sm">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={`w-full bg-white/5 border ${
                                errors.email ? 'border-red-500/50' : 'border-white/20'
                                } rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-white/80 font-medium mb-2 text-sm">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-white/5 border ${
                                errors.password ? 'border-red-500/50' : 'border-white/20'
                                } rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1.5">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password (Register Only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border ${
                                        errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
                                    } rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-1.5">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="cursor-pointer w-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </div>

                {/* Switch Mode */}
                <div className="text-center">
                    <p className="text-white/60 text-sm">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={switchMode}
                            className="cursor-pointer text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
    
}

export default Login