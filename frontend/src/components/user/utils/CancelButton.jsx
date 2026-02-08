import {X} from "lucide-react"
import {motion} from "framer-motion"

const CancelButton = ({resetForm}) => {
    return (
        <motion.button
            whileHover={{
                backgroundColor: "rgba(255,255,255,0.2)"
            }}
            onClick={resetForm}
            className="cursor-pointer px-2 py-1 text-[14px] bg-white/5 border border-white/10 rounded-lg text-white/70 flex items-center gap-2"
        >
            <X className="w-4 h-4" />
            Cancel
        </motion.button>
    )
}

export default CancelButton