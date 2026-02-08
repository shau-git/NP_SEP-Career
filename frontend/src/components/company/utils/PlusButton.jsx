import {motion} from 'framer-motion'
import {Plus} from "lucide-react"

const PlusButton = ({title, handleAdd}) => {
    return (
        <motion.button 
            whileHover={{
                boxShadow: "0 0 25px rgba(168,85,247,0.5)",
            }}
            onClick={handleAdd}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg"
        >
            <Plus className="w-4 h-4" />
            <span className="sm:inline">{title}</span>
        </motion.button>
    )
}

export default PlusButton