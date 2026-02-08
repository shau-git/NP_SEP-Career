import {Plus} from 'lucide-react'
import {motion} from "framer-motion"

const PlusButton = ({handleClick}) => {
    return (
        <motion.button 
            whileHover={{
                backgroundColor: "rgba(168,85,247,0.5)",
            }}
            onClick={handleClick}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 cursor-pointer text-[13px]"
        >
            <Plus className="w-5 h-5" />
            Add
        </motion.button>
    )
}

export default PlusButton