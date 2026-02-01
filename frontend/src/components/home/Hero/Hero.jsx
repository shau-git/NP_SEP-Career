import React from 'react'
import { motion } from "framer-motion";

const Hero = () => {
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

                {/* search-container */}
                <div className="flex sm:flex-row flex-col gap-3.75 max-w-175 mt-0 mb-7.5 mx-auto">
                    {/* Input tags */}
                    <motion.input 
                        id="job"
                        type="text" 
                        placeholder="Job title, keywords, or company"
                        className="
                            flex-1 py-3.5 px-6 bg-white/10 border-2 border-white/20 rounded-full text-[15px]
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
                    />
                    <motion.input 
                        id="location"
                        type="text" 
                        placeholder="Location"
                        className="
                            flex-1 py-3.5 px-6 bg-white/10 border-2 border-white/20 rounded-full text-[15px]
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
                    />
                    {/* Search Button */}
                    <motion.button 
                        variants={{
                            hover: {
                                y: "-2px", 
                                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.5)"
                            }
                        }}
                        transition={{ 
                            duration: 0.3, 
                            ease: "easeInOut" 
                        }}
                        whileHover="hover"
                        className="
                            py-3.5 px-10 cursor-pointer text-[16px] rounded-full font-semibold
                            bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)]
                            "
                    >
                            Search
                    </motion.button>
                </div>
            </div>
        </section>
    )
}

export default Hero