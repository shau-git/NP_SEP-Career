import {RotateCcw} from "lucide-react"
import {motion} from "framer-motion"

const RestoreButton = ({handleRestore}) => {
    return (
        <motion.button
            whileHover={{
                    backgroundColor: "rgba(74,222,128,0.2)"
                }}
            onClick={handleRestore}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-left text-white border-t border-white/10"
            title="Restore"
        >
            <RotateCcw className="w-4 h-4 text-green-400" />
        </motion.button>
    )
}

export default RestoreButton