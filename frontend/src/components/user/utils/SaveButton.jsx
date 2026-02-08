import {Save} from "lucide-react"
import {motion} from "framer-motion"

const SaveButton = ({
    field,
    handleSave,
    editingId,
}) => {
    return (
        <motion.button
            onClick={handleSave}
            whileHover={{
                boxShadow: "0 0 25px rgba(168,85,247,0.5)",
            }}
            className="cursor-pointer px-2 py-1 text-[14px] bg-linear-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium flex items-center gap-2"
        >
            <Save className="w-4 h-4" />
            {editingId ? 'Update' : 'Add'} {field}
        </motion.button>
    )
}

export default SaveButton