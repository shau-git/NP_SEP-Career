import {motion} from 'framer-motion'

const ClearButton = ({handleClick}) => {
    return (
        <motion.button
            whileHover={{
                backgroundColor: "rgba(255,255,255,0.3)",
            }}  
            onClick={handleClick}
            className="cursor-pointer flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
        >
            Clear all
        </motion.button>
    )
}

export default ClearButton