import { motion } from "framer-motion";

const Tooltip = ({ children, name }) => {
    return (
        // The "Hover Zone"
        <motion.div
            className="relative flex items-center justify-center"
            initial="initial"
            whileHover="hover"
        >
            {/* The Button is injected here */}
            {children}

            {/* The Tooltip Label (Separate from button logic) */}
            <motion.div
                variants={{
                    initial: { opacity: 0, y: 10, scale: 0.95 },
                    hover: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { duration: 0.5, delay: 0.35, ease: "easeOut" }
                    }
                }}
                className="absolute -bottom-12 px-3 py-1.5 bg-slate-800 text-white text-[11px] font-medium rounded-lg border border-white/10 shadow-2xl pointer-events-none whitespace-nowrap z-50"
            >
                {name}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-t border-l border-white/10" />
            </motion.div>
        </motion.div>
    );
};

export default Tooltip;