import {Trash2} from "lucide-react"
import {motion} from "framer-motion"

const DeleteButton = ({handleDelete}) => {
    return (
        <motion.button
            whileHover={{
                    backgroundColor: "rgba(239,68,68,0.2)"
                }}
            onClick={handleDelete}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-left text-white border-t border-white/10"
            title="Delete"
        >
            <Trash2 className="w-4 h-4 text-red-400" />
        </motion.button>
    )
}

export default DeleteButton