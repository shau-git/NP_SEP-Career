import { motion } from "framer-motion";
import {useEffect, useState } from "react"

const Quote = () => {

    const [currentQuote, setCurrentQuote] = useState(0);

    const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            staggerChildren: 0.3, // Animates children one after another
        },
        },
    };

    // Animation variants for the text
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     setCurrentQuote((prev) => (prev + 1) % quotes.length);
    //     }, 8000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <motion.section
            className="
                px-12.5 py-15 mx-12.5 relative overflow-hidden 
                text-center rounded-3xl border border-white/10
                backdrop-blur-[10px] m-12.5 
                bg-[linear-gradient(135deg,rgba(102,126,234,0.15)_0%,rgba(118,75,162,0.15)_100%)]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} // Only animate once when scrolled into view
            variants={containerVariants}
        >
        {/* Background Pseudo-element replacement //text-[200px]*/}
        <span
            className="
                absolute text-[150px] -top-16 left-12 pointer-none opacity-5
               font-['Georgia,serif']"
        >
            &quot;
        </span>

        <div className="relative z-1 text-center max-w-4xl mx-auto h-48 sm:h-30 flex flex-col justify-center">
            <motion.div 
                className="text-2xl md:text-3xl mb-5 italic leading-normal" 
                variants={itemVariants}
            >
                &quot;{quotes[currentQuote].text}&quot;
            </motion.div>

            <motion.div 
                className="text-[1.2em] font-semibold opacity-8" 
                variants={itemVariants}
            >
                — {quotes[currentQuote].author}
            </motion.div>
        </div>
    </motion.section>
    )
}

export default Quote