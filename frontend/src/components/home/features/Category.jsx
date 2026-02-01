import React from 'react'
import { motion } from "framer-motion";

const Category = () => {
    const categories = [
        { name: 'IT & Technology', Icon: "💻", color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Finance & Business', Icon: "💼", color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { name: 'Engineering',  Icon: "⚙️", color: 'text-gray-600', bg: 'bg-gray-100' },
        { name: 'Healthcare', Icon: "🏥", color: 'text-red-600', bg: 'bg-red-100' },
        { name: 'Creative & Media',  Icon: "🎨", color: 'text-violet-600', bg: 'bg-violet-100' },
        { name: 'F&B (Food & Bev)', Icon: "🍔", color: 'text-amber-600', bg: 'bg-amber-100' },
        { name: 'Retail & Sales',  Icon: "🛍️", color: 'text-pink-600', bg: 'bg-pink-100' },
        { name: 'Logistics & Trades', Icon: "🚚", color: 'text-orange-600', bg: 'bg-orange-100' },
        { name: 'Education',  Icon: "📚", color: 'text-indigo-600', bg: 'bg-indigo-100' },
        
    ]
    return (
        <section className="px-6 py-24">
            <h2 className="text-center text-[2em] font-bold mb-14 bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] bg-clip-text text-transparent">Browse by Industry</h2>
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categories.map((cat) => (
                    <motion.button 
                        key={cat.name}
                        className="
                            px-8 py-6 rounded-[20px] group
                            relative overflow-hidden bg-white/5  border
                            border-white/10 backdrop-blur-[10px] text-center cursor-pointer hover:bg-[rgba(102, 126, 234, 0.5)]"
                        variants={{
                            hover: {
                                boxShadow: "0 20px 40px rgba(102,126,234,0.3)"
                            }
                        }}
                        whileHover="hover"
                        initial="initial"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <motion.div 
                            className="absolute inset-0 z-5"
                            variants={{
                                initial: { opacity: 0 },
                                hover: { opacity: 1 }
                            }}
                            style={{
                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                            }}
                        />
                        <div className="
                            text-[50px] mb-2 relative z-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] 
                            transition-all duration-300 ease-in-out group-hover:scale-[1.15] group-hover:rotate-[5deg]"
                        >
                            {cat.Icon}
                        </div>
                        <div className="text-lg font-semibold mb-2">{cat.name}</div>
                        <div className="text-sm text-gray-400 relative z-1">467 jobs</div>
                    </motion.button>
                ))}
            </div>
        </section>
    )
}

export default Category