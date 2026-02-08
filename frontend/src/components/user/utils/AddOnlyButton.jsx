import {Save} from 'lucide-react'
import {motion} from "framer-motion"

const AddOnlyButton = ({handleAdd, field}) => {
    return (
        <motion.button
            whileHover={{
                boxShadow: "0 0 25px rgba(168,85,247,0.5)",
            }}
            onClick={handleAdd}
            className="cursor-pointer px-2 py-1 text-[14px] bg-linear-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium flex items-center gap-2"
        >
            <Save className="w-4 h-4" />
            Add {field}
        </motion.button>
    )
}

export default AddOnlyButton