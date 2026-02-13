import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {useState} from "react"
import {X, Search} from "lucide-react"

const Hero = () => {
    const navigate = useNavigate()
    const [searchTitle, setSearchTitle] = useState("")
    
    const handleClick = () => {
        if (!searchTitle.trim()) return; // Don't search if empty
        const params = new URLSearchParams();
        params.append('title', searchTitle);
        return navigate(`/searchjob?${params}`)
    }
    
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-25 px-5 pb-7.5">
            {/* Bg Decoration */}
            <div 
                className="
                    absolute w-125 h-125 -top-52 -right-52 
                    bg-[radial-gradient(circle,rgba(102,126,234,0.3)_0%,transparent_70%)]
                    animate-[float_8s_ease-in-out_infinite]"
            />
            <div className="
                absolute w-100 h-100 -bottom-40 -left-40 
                bg-[radial-gradient(circle,rgba(118,75,162,0.3)_0%,transparent_70%)] 
                animate-[float_6s_ease-in-out_reverse_infinite]"
            />

            {/* Hero content */}
            <div className="max-w-300 text-center relative z-1">
                <h1 className="
                    sm:text-[65px] text-[35.2px] mb-4 bg-linear-to-r from-[rgb(102,126,234)] via-[rgb(118,75,162)] font-bold sm:leading-19
                    to-[rgb(240,147,251)] bg-clip-text text-transparent animate-[slideUp_1s_ease-out]"
                >
                    Find Your Dream Career
                </h1>
                <p className="sm:text-[20px] text-[15px] text-gray-400 mb-10 animate-[slideUp_1s_ease-out_0.2s_both]">
                    Discover thousands of opportunities from top companies worldwide
                </p>

                {/* Search Container */}
                <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto w-full">
                    <div className="relative flex-1 w-full">
                        {/* Decorative Icon */}
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-50" />
                        
                        <motion.input 
                            type="text" 
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            placeholder="Search job title"
                            className="
                                w-full py-4 pl-14 pr-12 
                                bg-white/5 border border-white/10 rounded-full 
                                text-white text-lg 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10
                                placeholder:text-gray-500 transition-all duration-300
                            " 
                            whileFocus={{ scale: 1.01 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                        />
                        {/* <motion.input
                            id="job"
                            type="text"
                            value={searchTitle}
                            placeholder="Seach By Job title"
                            className="
                                w-full py-4 pl-14 pr-12 bg-white/10 border-2 border-white/20 rounded-full text-[15px]
                                text-white text-base backdrop-blur-[10px]
                                focus:outline-none placeholder:text-white/50
                            "
                            whileFocus={{
                                borderColor: "rgb(96,165,245)",
                                boxShadow: "0 0 0 3px rgba(102,126,234,0.2)"
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        /> */}

                        {/* Clear Button */}
                        {searchTitle && (
                            <button 
                                onClick={() => setSearchTitle('')}
                                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05, translateY: "-2px" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClick}
                        className="
                            w-full sm:w-auto py-4 px-10 cursor-pointer 
                            text-lg rounded-full font-bold text-white
                            bg-linear-to-r from-[#667eea] to-[#764ba2]
                            shadow-[0_10px_20px_rgba(102,126,234,0.3)]
                            hover:shadow-[0_15px_30px_rgba(102,126,234,0.4)]
                            transition-all duration-300
                        "
                    >
                        Search Jobs
                    </motion.button>
                </div>
            </div>
        </section>
    )
}

export default Hero